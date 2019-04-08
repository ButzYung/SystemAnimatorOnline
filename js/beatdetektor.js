/*
 *  BeatDetektor.js
 *
 *  BeatDetektor - CubicFX Visualizer Beat Detection & Analysis Algorithm
 *  Javascript port by Charles J. Cliffe and Corban Brook
 *
 *  Created by Charles J. Cliffe on 09-11-30.
 *  Copyright 2009 Charles J. Cliffe. All rights reserved.
 *
 *  BeatDetektor is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Please note that only the Javascript version of BeatDetektor is licensed
 *  under the terms of LGPL version 3; ports of BeatDetektor or derivatives
 *  in other languages are licensed under the terms of GPL version 3.
 *
 *  BeatDetektor is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *  Please contact cj@cubicproductions.com if you seek alternate
 *  licensing terms for your project.
 *
 */


/* 
 BeatDetektor class


 Theory:

 Trigger detection is performed using a trail of moving averages, 
 
 The FFT input is broken up into 128 ranges and averaged, each range has two moving 
 averages that tail each other at a rate of (1.0 / BD_DETECTION_RATE) seconds.  

 Each time the moving average for a range exceeds it's own tailing average by:

 (moving_average[range] * BD_DETECTION_FACTOR >= moving_average[range])

 if this is true there's a rising edge and a detection is flagged for that range. 
 Next a trigger gap test is performed between rising edges and timestamp recorded. 

 If the gap is larger than our BPM window (in seconds) then we can discard it and
 reset the timestamp for a new detection -- but only after checking to see if it's a 
 reasonable match for 2* the current detection in case it's only triggered every
 other beat. Gaps that are lower than the BPM window are ignored and the last 
 timestamp will not be reset.  

 Gaps that are within a reasonable window are run through a quality stage to determine 
 how 'close' they are to that channel's current prediction and are incremented or 
 decremented by a weighted value depending on accuracy. Repeated hits of low accuracy 
 will still move a value towards erroneous detection but it's quality will be lowered 
 and will not be eligible for the gap time quality draft.
 
 Once quality has been assigned ranges are reviewed for good match candidates and if 
 BD_MINIMUM_CONTRIBUTIONS or more ranges achieve a decent ratio (with a factor of 
 BD_QUALITY_TOLERANCE) of contribution to the overall quality we take them into the 
 contest round.  Note that the contest round  won't run on a given process() call if 
 the total quality achieved does not meet or exceed BD_QUALITY_TOLERANCE.
  
 Each time through if a select draft of BPM ranges has achieved a reasonable quality 
 above others it's awarded a value in the BPM contest.  The BPM contest is a hash 
 array indexed by an integer BPM value, each draft winner is awarded BD_QUALITY_REWARD.

 Finally the BPM contest is examined to determine a leader and all contest entries 
 are normalized to a total value of BD_FINISH_LINE, whichever range is closest to 
 BD_FINISH_LINE at any given point is considered to be the best guess however waiting 
 until a minimum contest winning value of about 20.0-25.0 will provide more accurate 
 results.  Note that the 20-25 rule may vary with lower and higher input ranges. 
 A winning value that exceeds 40 or hovers around 60 (the finish line) is pretty much
 a guaranteed match.


 Configuration Kernel Notes:

 The majority of the ratios and values have been reverse-engineered from my own  
 observation and visualization of information from various aspects of the detection 
 triggers; so not all parameters have a perfect definition nor perhaps the best value yet.
 However despite this it performs very well; I had expected several more layers 
 before a reasonable detection would be achieved. Comments for these parameters will be 
 updated as analysis of their direct effect is explored.


 Input Restrictions:

 bpm_maximum must be within the range of (bpm_minimum*2)-1
 i.e. minimum of 50 must have a maximum of 99 because 50*2 = 100


 Changelog: 
 
 01/17/2010 - Charles J. Cliffe 
  - Tested and tweaked default kernel values for tighter detection
  - Added BeatDetektor.config_48_95, BeatDetektor.config_90_179 and BeatDetektor.config_150_280 for more refined detection ranges
  - Updated unit test to include new range config example

02/21/2010 - Charles J. Cliffe 
 - Fixed numerous bugs and divide by 0 on 1% match causing poor accuracy
 - Re-worked the quality calulations, accuracy improved 8-10x
 - Primary value is now a fractional reading (*10, just divide by 10), added win_bpm_int_lo for integral readings
 - Added feedback loop for current_bpm to help back-up low quality channels
 - Unified range configs, now single default should be fine
 - Extended quality reward 'funnel'

*/


// AT mod
var AT_bass_band
if (AT_bass_band == null)
  AT_bass_band = 0


BeatDetektor = function(bpm_minimum, bpm_maximum, alt_config)
{
	if (typeof(bpm_minimum)=='undefined') bpm_minimum = 85.0;
	if (typeof(bpm_maximum)=='undefined') bpm_maximum = 169.0
	
	this.config = (typeof(alt_config)!='undefined')?alt_config:BeatDetektor.config;
	
	this.BPM_MIN = bpm_minimum;
	this.BPM_MAX = bpm_maximum;

	this.beat_counter = 0;
	this.half_counter = 0;
	this.quarter_counter = 0;

	// current average (this sample) for range n
	this.a_freq_range = new Array(this.config.BD_DETECTION_RANGES);
	// moving average of frequency range n
	this.ma_freq_range = new Array(this.config.BD_DETECTION_RANGES);
	// moving average of moving average of frequency range n
	this.maa_freq_range = new Array(this.config.BD_DETECTION_RANGES);
	// timestamp of last detection for frequecy range n
	this.last_detection = new Array(this.config.BD_DETECTION_RANGES);

	// moving average of gap lengths
	this.ma_bpm_range = new Array(this.config.BD_DETECTION_RANGES);
	// moving average of moving average of gap lengths
	this.maa_bpm_range = new Array(this.config.BD_DETECTION_RANGES);

	// range n quality attribute, good match  = quality+, bad match  = quality-, min  = 0
	this.detection_quality = new Array(this.config.BD_DETECTION_RANGES);

	// current trigger state for range n
	this.detection = new Array(this.config.BD_DETECTION_RANGES); 
	
	this.reset();
	
	if (typeof(console)!='undefined')
	{
		console.log("BeatDetektor("+this.BPM_MIN+","+this.BPM_MAX+") created.")
	}
}

BeatDetektor.prototype.reset = function()
{
//	var bpm_avg = 60.0/((this.BPM_MIN+this.BPM_MAX)/2.0);

	for (var i = 0; i < this.config.BD_DETECTION_RANGES; i++)
	{
		this.a_freq_range[i] = 0.0;
		this.ma_freq_range[i] = 0.0;
		this.maa_freq_range[i] = 0.0;
		this.last_detection[i] = 0.0;
		
		this.ma_bpm_range[i] = 
		this.maa_bpm_range[i] = 60.0/this.BPM_MIN + ((60.0/this.BPM_MAX-60.0/this.BPM_MIN) * (i/this.config.BD_DETECTION_RANGES));		
		
		this.detection_quality[i] = 0.0;
		this.detection[i] = false;
	}
	
	this.ma_quality_avg = 0;
	this.ma_quality_total = 0;
	
	this.bpm_contest = new Array();
	this.bpm_contest_lo = new Array();
	
	this.quality_total = 0.0;
	this.quality_avg = 0.0;

	this.current_bpm = 0.0; 
	this.current_bpm_lo = 0.0; 

	this.winning_bpm = 0.0; 
	this.win_val = 0.0;
	this.winning_bpm_lo = 0.0; 
	this.win_val_lo = 0.0;

	this.win_bpm_int = 0;
	this.win_bpm_int_lo = 0;

	this.bpm_predict = 0;

	this.is_erratic = false;
	this.bpm_offset = 0.0;
	this.last_timer = 0.0;
	this.last_update = 0.0;

	this.bpm_timer = 0.0;
	this.beat_counter = 0;
	this.half_counter = 0;
	this.quarter_counter = 0;
}


BeatDetektor.config_default = {
	BD_DETECTION_RANGES : 128,  // How many ranges to quantize the FFT into
	BD_DETECTION_RATE : 12.0,   // Rate in 1.0 / BD_DETECTION_RATE seconds
	BD_DETECTION_FACTOR : 0.915, // Trigger ratio
	BD_QUALITY_DECAY : 0.6,     // range and contest decay
	BD_QUALITY_TOLERANCE : 0.96,// Use the top x % of contest results
	BD_QUALITY_REWARD : 10.0,    // Award weight
	BD_QUALITY_STEP : 0.1,     // Award step (roaming speed)
	BD_MINIMUM_CONTRIBUTIONS : 6,   // At least x ranges must agree to process a result
	BD_FINISH_LINE : 60.0,          // Contest values wil be normalized to this finish line
	// this is the 'funnel' that pulls ranges in / out of alignment based on trigger detection
	BD_REWARD_TOLERANCES : [ 0.001, 0.005, 0.01, 0.02, 0.04, 0.08, 0.10, 0.15, 0.30 ],  // .1%, .5%, 1%, 2%, 4%, 8%, 10%, 15%
	BD_REWARD_MULTIPLIERS : [ 20.0, 10.0, 8.0, 1.0, 1.0/2.0, 1.0/4.0, 1.0/8.0, 1/16.0, 1/32.0 ]
};


// Default configuration kernel
BeatDetektor.config = BeatDetektor.config_default;


BeatDetektor.prototype.process = function(timer_seconds, fft_data)
{
	if (!this.last_timer) { this.last_timer = timer_seconds; return; }	// ignore 0 start time
	if (this.last_timer > timer_seconds) { this.reset(); return; }
	
	var timestamp = timer_seconds;
	
	this.last_update = timer_seconds - this.last_timer;
	this.last_timer = timer_seconds;

	if (this.last_update > 1.0) { this.reset(); return; }

	var i,x;
	var v;
	
	var bpm_floor = 60.0/this.BPM_MAX;
	var bpm_ceil = 60.0/this.BPM_MIN;
	
	var range_step = (fft_data.length / this.config.BD_DETECTION_RANGES);
	var range = 0;
	
		
	for (x=0; x<fft_data.length; x+=range_step)
	{
		this.a_freq_range[range] = 0;
		
		// accumulate frequency values for this range
		for (i = x; i<x+range_step; i++)
		{
			v = Math.abs(fft_data[i]);
			this.a_freq_range[range] += v;
		}
		
		// average for range
		this.a_freq_range[range] /= range_step;
		
		// two sets of averages chase this one at a 
		
		// moving average, increment closer to a_freq_range at a rate of 1.0 / BD_DETECTION_RATE seconds
		this.ma_freq_range[range] -= (this.ma_freq_range[range]-this.a_freq_range[range])*this.last_update*this.config.BD_DETECTION_RATE;
		// moving average of moving average, increment closer to this.ma_freq_range at a rate of 1.0 / BD_DETECTION_RATE seconds
		this.maa_freq_range[range] -= (this.maa_freq_range[range]-this.ma_freq_range[range])*this.last_update*this.config.BD_DETECTION_RATE;
		
		// if closest moving average peaks above trailing (with a tolerance of BD_DETECTION_FACTOR) then trigger a detection for this range 
		var det = (this.ma_freq_range[range]*this.config.BD_DETECTION_FACTOR >= this.maa_freq_range[range]);
		
		// compute bpm clamps for comparison to gap lengths
		
		// clamp detection averages to input ranges
		if (this.ma_bpm_range[range] > bpm_ceil) this.ma_bpm_range[range] = bpm_ceil;
		if (this.ma_bpm_range[range] < bpm_floor) this.ma_bpm_range[range] = bpm_floor;
		if (this.maa_bpm_range[range] > bpm_ceil) this.maa_bpm_range[range] = bpm_ceil;
		if (this.maa_bpm_range[range] < bpm_floor) this.maa_bpm_range[range] = bpm_floor;
			
		var rewarded = false;
		
		// new detection since last, test it's quality
		if (!this.detection[range] && det)
		{
			// calculate length of gap (since start of last trigger)
			var trigger_gap = timestamp-this.last_detection[range];
			
			// trigger falls within acceptable range, 
			if (trigger_gap < bpm_ceil && trigger_gap > (bpm_floor))
			{		
				// compute gap and award quality
				
				// use our tolerances as a funnel to edge detection towards the most likely value
				for (i = 0; i < this.config.BD_REWARD_TOLERANCES.length; i++)
				{
					if (Math.abs(this.ma_bpm_range[range]-trigger_gap) < this.ma_bpm_range[range]*this.config.BD_REWARD_TOLERANCES[i])
					{
						this.detection_quality[range] += this.config.BD_QUALITY_REWARD * this.config.BD_REWARD_MULTIPLIERS[i]; 
						rewarded = true;
					}
				}				
				
				if (rewarded) 
				{
					this.last_detection[range] = timestamp;
				}
			}
			else if (trigger_gap >= bpm_ceil) // low quality, gap exceeds maximum time
			{
				// start a new gap test, next gap is guaranteed to be longer
				
				// test for 1/2 beat
				trigger_gap /= 2.0;

				if (trigger_gap < bpm_ceil && trigger_gap > (bpm_floor)) for (i = 0; i < this.config.BD_REWARD_TOLERANCES.length; i++)
				{
					if (Math.abs(this.ma_bpm_range[range]-trigger_gap) < this.ma_bpm_range[range]*this.config.BD_REWARD_TOLERANCES[i])
					{
						this.detection_quality[range] += this.config.BD_QUALITY_REWARD * this.config.BD_REWARD_MULTIPLIERS[i]; 
						rewarded = true;
					}
				}
				
				
				// decrement quality if no 1/2 beat reward
				if (!rewarded) 
				{
					trigger_gap *= 2.0;
				}
				this.last_detection[range] = timestamp;	
			}
			
			if (rewarded)
			{
				var qmp = (this.detection_quality[range]/this.quality_avg)*this.config.BD_QUALITY_STEP;
				if (qmp > 1.0)
				{
					qmp = 1.0;
				}

				this.ma_bpm_range[range] -= (this.ma_bpm_range[range]-trigger_gap) * qmp;				
				this.maa_bpm_range[range] -= (this.maa_bpm_range[range]-this.ma_bpm_range[range]) * qmp;
			}
			else if (trigger_gap >= bpm_floor && trigger_gap <= bpm_ceil)
			{
				if (this.detection_quality[range] < this.quality_avg*this.config.BD_QUALITY_TOLERANCE && this.current_bpm)
				{
					this.ma_bpm_range[range] -= (this.ma_bpm_range[range]-trigger_gap) * this.config.BD_QUALITY_STEP;
					this.maa_bpm_range[range] -= (this.maa_bpm_range[range]-this.ma_bpm_range[range]) * this.config.BD_QUALITY_STEP;
				}
				this.detection_quality[range] -= this.config.BD_QUALITY_STEP;
			}
			else if (trigger_gap >= bpm_ceil)
			{
				if ((this.detection_quality[range] < this.quality_avg*this.config.BD_QUALITY_TOLERANCE) && this.current_bpm)
				{
					this.ma_bpm_range[range] -= (this.ma_bpm_range[range]-this.current_bpm) * 0.5;
					this.maa_bpm_range[range] -= (this.maa_bpm_range[range]-this.ma_bpm_range[range]) * 0.5 ;
				}
				this.detection_quality[range]-= this.config.BD_QUALITY_STEP;
			}
			
		}
				
		if ((!rewarded && timestamp-this.last_detection[range] > bpm_ceil) || (det && Math.abs(this.ma_bpm_range[range]-this.current_bpm) > this.bpm_offset)) 
			this.detection_quality[range] -= this.detection_quality[range]*this.config.BD_QUALITY_STEP*this.config.BD_QUALITY_DECAY*this.last_update;
		
		// quality bottomed out, set to 0
		if (this.detection_quality[range] < 0.001) this.detection_quality[range]=0.001;
				
		this.detection[range] = det;		
		
		range++;
	}
		
	// total contribution weight
	this.quality_total = 0;
	
	// total of bpm values
	var bpm_total = 0;
	// number of bpm ranges that contributed to this test
	var bpm_contributions = 0;
	
	
	// accumulate quality weight total
	for (var x=0; x<this.config.BD_DETECTION_RANGES; x++)
	{
		this.quality_total += this.detection_quality[x];
	}
	
	
	this.quality_avg = this.quality_total / this.config.BD_DETECTION_RANGES;
	
	
	if (this.quality_total)
	{
		// determine the average weight of each quality range
		this.ma_quality_avg += (this.quality_avg - this.ma_quality_avg) * this.last_update * this.config.BD_DETECTION_RATE/2.0;

		this.maa_quality_avg += (this.ma_quality_avg - this.maa_quality_avg) * this.last_update;
		this.ma_quality_total += (this.quality_total - this.ma_quality_total) * this.last_update * this.config.BD_DETECTION_RATE/2.0;

		this.ma_quality_avg -= 0.98*this.ma_quality_avg*this.last_update*3.0;
	}
	else
	{
		this.quality_avg = 0.001;
	}

	if (this.ma_quality_total <= 0) this.ma_quality_total = 0.001;
	if (this.ma_quality_avg <= 0) this.ma_quality_avg = 0.001;
	
	var avg_bpm_offset = 0.0;
	var offset_test_bpm = this.current_bpm;
	var draft = new Array();
	
	if (this.quality_avg) for (x=0; x<this.config.BD_DETECTION_RANGES; x++)
	{
		// if this detection range weight*tolerance is higher than the average weight then add it's moving average contribution 
		if (this.detection_quality[x]*this.config.BD_QUALITY_TOLERANCE >= this.ma_quality_avg)
		{
			if (this.ma_bpm_range[x] < bpm_ceil && this.ma_bpm_range[x] > bpm_floor)
			{
				bpm_total += this.maa_bpm_range[x];

				var draft_float = Math.round((60.0/this.maa_bpm_range[x])*1000.0);
				
				draft_float = (Math.abs(Math.ceil(draft_float)-(60.0/this.current_bpm)*1000.0)<(Math.abs(Math.floor(draft_float)-(60.0/this.current_bpm)*1000.0)))?Math.ceil(draft_float/10.0):Math.floor(draft_float/10.0);
				var draft_int = parseInt(draft_float/10.0);
			//	if (draft_int) console.log(draft_int);
				if (typeof(draft[draft_int]=='undefined')) draft[draft_int] = 0;
				
				draft[draft_int]+=this.detection_quality[x]/this.quality_avg;
				bpm_contributions++;
				if (offset_test_bpm == 0.0) offset_test_bpm = this.maa_bpm_range[x];
				else 
				{
					avg_bpm_offset += Math.abs(offset_test_bpm-this.maa_bpm_range[x]);
				}
				
				
			}
		}
	}
		
	// if we have one or more contributions that pass criteria then attempt to display a guess
	var has_prediction = (bpm_contributions>=this.config.BD_MINIMUM_CONTRIBUTIONS)?true:false;

	var draft_winner=0;
	var win_val = 0;
	
	if (has_prediction) 
	{
		for (var draft_i in draft)
		{
			if (draft[draft_i] > win_val)
			{
				win_val = draft[draft_i];
				draft_winner = draft_i;
			}
		}
		
		this.bpm_predict = 60.0/(draft_winner/10.0);
		
		avg_bpm_offset /= bpm_contributions;
		this.bpm_offset = avg_bpm_offset;
		
		if (!this.current_bpm)  
		{
			this.current_bpm = this.bpm_predict; 
		}
	}
		
	if (this.current_bpm && this.bpm_predict) this.current_bpm -= (this.current_bpm-this.bpm_predict)*this.last_update;	
	
	// hold a contest for bpm to find the current mode
	var contest_max=0;
	
	for (var contest_i in this.bpm_contest)
	{
		if (contest_max < this.bpm_contest[contest_i]) contest_max = this.bpm_contest[contest_i]; 
		if (this.bpm_contest[contest_i] > this.config.BD_FINISH_LINE/2.0)
		{
			var draft_int_lo = parseInt(Math.round((contest_i)/10.0));
			if (this.bpm_contest_lo[draft_int_lo] != this.bpm_contest_lo[draft_int_lo]) this.bpm_contest_lo[draft_int_lo] = 0;
			this.bpm_contest_lo[draft_int_lo]+= (this.bpm_contest[contest_i]/6.0)*this.last_update;
		}
	}
		
	// normalize to a finish line
	if (contest_max > this.config.BD_FINISH_LINE) 
	{
		for (var contest_i in this.bpm_contest)
		{
			this.bpm_contest[contest_i]=(this.bpm_contest[contest_i]/contest_max)*this.config.BD_FINISH_LINE;
		}
	}

	contest_max = 0;
	for (var contest_i in this.bpm_contest_lo)
	{
		if (contest_max < this.bpm_contest_lo[contest_i]) contest_max = this.bpm_contest_lo[contest_i]; 
	}

	// normalize to a finish line
	if (contest_max > this.config.BD_FINISH_LINE) 
	{
		for (var contest_i in this.bpm_contest_lo)
		{
			this.bpm_contest_lo[contest_i]=(this.bpm_contest_lo[contest_i]/contest_max)*this.config.BD_FINISH_LINE;
		}
	}

	
	// decay contest values from last loop
	for (contest_i in this.bpm_contest)
	{
		this.bpm_contest[contest_i]-=this.bpm_contest[contest_i]*(this.last_update/this.config.BD_DETECTION_RATE);
	}
	
	// decay contest values from last loop
	for (contest_i in this.bpm_contest_lo)
	{
		this.bpm_contest_lo[contest_i]-=this.bpm_contest_lo[contest_i]*(this.last_update/this.config.BD_DETECTION_RATE);
	}
	
	this.bpm_timer+=this.last_update;
	
	var winner = 0;
	var winner_lo = 0;
	
	// attempt to display the beat at the beat interval ;)
	if (this.bpm_timer > this.winning_bpm/4.0 && this.current_bpm)
	{		
		this.win_val = 0;
		this.win_val_lo = 0;

		if (this.winning_bpm) while (this.bpm_timer > this.winning_bpm/4.0) this.bpm_timer -= this.winning_bpm/4.0;
		
		// increment beat counter
		
		this.quarter_counter++;		
		this.half_counter= parseInt(this.quarter_counter/2);
		this.beat_counter = parseInt(this.quarter_counter/4);
		
		// award the winner of this iteration
		var idx = parseInt(Math.round((60.0/this.current_bpm)*10.0));
		if (typeof(this.bpm_contest[idx])=='undefined') this.bpm_contest[idx] = 0;
		this.bpm_contest[idx]+=this.config.BD_QUALITY_REWARD;
		
		
		// find the overall winner so far
		for (var contest_i in this.bpm_contest)
		{
			if (this.win_val < this.bpm_contest[contest_i])
			{
				winner = contest_i;
				this.win_val = this.bpm_contest[contest_i];
			}
		}
		
		if (winner)
		{
			this.win_bpm_int = parseInt(winner);
			this.winning_bpm = (60.0/(winner/10.0));
		}
		
		// find the overall winner so far
		for (var contest_i in this.bpm_contest_lo)
		{
			if (this.win_val_lo < this.bpm_contest_lo[contest_i])
			{
				winner_lo = contest_i;
				this.win_val_lo = this.bpm_contest_lo[contest_i];
			}
		}
		
		if (winner_lo)
		{
			this.win_bpm_int_lo = parseInt(winner_lo);
			this.winning_bpm_lo = 60.0/winner_lo;
		}
		
		
//		if (typeof(console)!='undefined' && (this.beat_counter % 4) == 0) console.log("BeatDetektor("+this.BPM_MIN+","+this.BPM_MAX+"): [ Current Estimate: "+winner+" BPM ] [ Time: "+(parseInt(timer_seconds*1000.0)/1000.0)+"s, Quality: "+(parseInt(this.quality_total*1000.0)/1000.0)+", Rank: "+(parseInt(this.win_val*1000.0)/1000.0)+", Jitter: "+(parseInt(this.bpm_offset*1000000.0)/1000000.0)+" ]");
	}

}

// Sample Modules
BeatDetektor.modules = new Object(); 
BeatDetektor.modules.vis = new Object();

// simple bass kick visualizer assistant module
BeatDetektor.modules.vis.BassKick = function()
{
	this.is_kick = false;
}

BeatDetektor.modules.vis.BassKick.prototype.process = function(det)
{
	this.is_kick = ((det.detection[0] && det.detection[1]) || (det.ma_freq_range[AT_bass_band]/det.maa_freq_range[AT_bass_band])>1.4);
}

BeatDetektor.modules.vis.BassKick.prototype.isKick = function()
{
	return this.is_kick;
}


// simple vu spectrum visualizer assistant module
BeatDetektor.modules.vis.VU = function()
{
	this.vu_levels = new Array();	
}

BeatDetektor.modules.vis.VU.prototype.process = function(det,lus)
{
		var i,det_val,det_max = 0.0;
		if (typeof(lus)=='undefined') lus = det.last_update;

		for (i = 0; i < det.config.BD_DETECTION_RANGES; i++)
		{
			det_val = (det.ma_freq_range[i]/det.maa_freq_range[i]);	
			if (det_val > det_max) det_max = det_val;
		}		

		if (det_max <= 0) det_max = 1.0;

		for (i = 0; i < det.config.BD_DETECTION_RANGES; i++)
		{
			det_val = (det.ma_freq_range[i]/det.maa_freq_range[i]); //fabs(fftData[i*2]/2.0);

			if (det_val != det_val) det_val = 0;

			//&& (det_val > this.vu_levels[i])
			if (det_val>1.0)
			{
				det_val -= 1.0;
				if (det_val>1.0) det_val = 1.0;

				if (det_val > this.vu_levels[i]) 
					this.vu_levels[i] = det_val;
				else if (det.current_bpm) this.vu_levels[i] -= (this.vu_levels[i]-det_val)*lus*(1.0/det.current_bpm)*3.0;
			}
			else 
			{
				if (det.current_bpm) this.vu_levels[i] -= (lus/det.current_bpm)*2.0;
			}

			if (this.vu_levels[i] < 0 || this.vu_levels[i] != this.vu_levels[i]) this.vu_levels[i] = 0;
		}
}


// returns vu level for BD_DETECTION_RANGES range[x]
BeatDetektor.modules.vis.VU.prototype.getLevel = function(x)
{
	return this.vu_levels[x];
}