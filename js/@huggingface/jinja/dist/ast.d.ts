import type { Token } from "./lexer";
/**
 * Statements do not result in a value at runtime. They contain one or more expressions internally.
 */
export declare class Statement {
    type: string;
}
/**
 * Defines a block which contains many statements. Each chat template corresponds to one Program.
 */
export declare class Program extends Statement {
    body: Statement[];
    type: string;
    constructor(body: Statement[]);
}
export declare class If extends Statement {
    test: Expression;
    body: Statement[];
    alternate: Statement[];
    type: string;
    constructor(test: Expression, body: Statement[], alternate: Statement[]);
}
/**
 * Loop over each item in a sequence
 * https://jinja.palletsprojects.com/en/3.0.x/templates/#for
 */
export declare class For extends Statement {
    loopvar: Identifier | TupleLiteral;
    iterable: Expression;
    body: Statement[];
    defaultBlock: Statement[];
    type: string;
    constructor(loopvar: Identifier | TupleLiteral, iterable: Expression, body: Statement[], defaultBlock: Statement[]);
}
export declare class SetStatement extends Statement {
    assignee: Expression;
    value: Expression;
    type: string;
    constructor(assignee: Expression, value: Expression);
}
export declare class Macro extends Statement {
    name: Identifier;
    args: Expression[];
    body: Statement[];
    type: string;
    constructor(name: Identifier, args: Expression[], body: Statement[]);
}
/**
 * Expressions will result in a value at runtime (unlike statements).
 */
export declare class Expression extends Statement {
    type: string;
}
export declare class MemberExpression extends Expression {
    object: Expression;
    property: Expression;
    computed: boolean;
    type: string;
    constructor(object: Expression, property: Expression, computed: boolean);
}
export declare class CallExpression extends Expression {
    callee: Expression;
    args: Expression[];
    type: string;
    constructor(callee: Expression, args: Expression[]);
}
/**
 * Represents a user-defined variable or symbol in the template.
 */
export declare class Identifier extends Expression {
    value: string;
    type: string;
    /**
     * @param {string} value The name of the identifier
     */
    constructor(value: string);
}
/**
 * Abstract base class for all Literal expressions.
 * Should not be instantiated directly.
 */
declare abstract class Literal<T> extends Expression {
    value: T;
    type: string;
    constructor(value: T);
}
/**
 * Represents a numeric constant in the template.
 */
export declare class NumericLiteral extends Literal<number> {
    type: string;
}
/**
 * Represents a text constant in the template.
 */
export declare class StringLiteral extends Literal<string> {
    type: string;
}
/**
 * Represents a boolean constant in the template.
 */
export declare class BooleanLiteral extends Literal<boolean> {
    type: string;
}
/**
 * Represents null (none) in the template.
 */
export declare class NullLiteral extends Literal<null> {
    type: string;
}
/**
 * Represents an array literal in the template.
 */
export declare class ArrayLiteral extends Literal<Expression[]> {
    type: string;
}
/**
 * Represents a tuple literal in the template.
 */
export declare class TupleLiteral extends Literal<Expression[]> {
    type: string;
}
/**
 * Represents an object literal in the template.
 */
export declare class ObjectLiteral extends Literal<Map<Expression, Expression>> {
    type: string;
}
/**
 * An operation with two sides, separated by an operator.
 * Note: Either side can be a Complex Expression, with order
 * of operations being determined by the operator.
 */
export declare class BinaryExpression extends Expression {
    operator: Token;
    left: Expression;
    right: Expression;
    type: string;
    constructor(operator: Token, left: Expression, right: Expression);
}
/**
 * An operation with two sides, separated by the | operator.
 * Operator precedence: https://github.com/pallets/jinja/issues/379#issuecomment-168076202
 */
export declare class FilterExpression extends Expression {
    operand: Expression;
    filter: Identifier | CallExpression;
    type: string;
    constructor(operand: Expression, filter: Identifier | CallExpression);
}
/**
 * An operation which filters a sequence of objects by applying a test to each object,
 * and only selecting the objects with the test succeeding.
 */
export declare class SelectExpression extends Expression {
    iterable: Expression;
    test: Expression;
    type: string;
    constructor(iterable: Expression, test: Expression);
}
/**
 * An operation with two sides, separated by the "is" operator.
 */
export declare class TestExpression extends Expression {
    operand: Expression;
    negate: boolean;
    test: Identifier;
    type: string;
    constructor(operand: Expression, negate: boolean, test: Identifier);
}
/**
 * An operation with one side (operator on the left).
 */
export declare class UnaryExpression extends Expression {
    operator: Token;
    argument: Expression;
    type: string;
    constructor(operator: Token, argument: Expression);
}
/**
 * Logical negation of an expression.
 */
export declare class LogicalNegationExpression extends Expression {
    argument: Expression;
    type: string;
    constructor(argument: Expression);
}
export declare class SliceExpression extends Expression {
    start: Expression | undefined;
    stop: Expression | undefined;
    step: Expression | undefined;
    type: string;
    constructor(start?: Expression | undefined, stop?: Expression | undefined, step?: Expression | undefined);
}
export declare class KeywordArgumentExpression extends Expression {
    key: Identifier;
    value: Expression;
    type: string;
    constructor(key: Identifier, value: Expression);
}
export {};
//# sourceMappingURL=ast.d.ts.map