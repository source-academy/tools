module.exports = {
	"plugins": [
		"more-naming-conventions"
	],
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 8,
		"ecmaFeatures": {
			"globalReturn": true
		}
    },
    "rules": {
		// 1) INDENTATION
        "indent": [ // 1 indentation level = 4 spaces
            "error",
            4,
			{ "FunctionDeclaration": {"body": 1, "parameters": 1}, // body & arguments increase one indentation level
			  "FunctionExpression": {"body": 1, "parameters": 1}, // body & arguments increase one indentation level
			  "CallExpression": {"arguments": "off"}, // no checking of call expression
			  "flatTernaryExpressions": false, // increase indentation level when line break in the middle of ternary expression
			  "outerIIFEBody": 0}
        ],
		
		
		// 2) LINE LENGTH
		"max-len": [ // maximum line length is 80
			"error",
			{"code": 80}
		],
		
		
		// 3) CURLY BRACES
		"brace-style": [ // enforce `one true brace style` (Egyptian), however allow declare and define in one single line 
			"error",
			"1tbs",
			{"allowSingleLine": true}
		],
		"curly": [ // use curly braces to wrap around a block, even if it contains only 1 line
			"error",
			"all"
		],
		"object-curly-newline": [ // one must always enter a linebreak after a '{'
			"error",
			"always"
		],
		
		
		// 4) WHITESPACE
		// 4.1) Operators
		"space-infix-ops": [ // leave space between binary and ternary operators, but not applicable to unary operators
			"error",
			{"int32Hint": false}
		],
		// 4.2) Function Definitions
		
		"arrow-spacing": [ // require spacing before and after arrow function
			"error",
			{"before": true,
			"after": true}
		],
		// 4.3) Conditional Expressions 
		"operator-linebreak": [ // require the linebreak to be before operator
								// e.g.  foo = 1
								//           + 2;
			"error",
			"before"
		],
		"multiline-ternary": [ // either write ternary expressions in one line or all spans multiple lines
			"error",
			"always-multiline"
		],		
		// 4.4) Conditional Statements and Functions
		"keyword-spacing": [ // space before and after keywords, e.g. "else"
			"error",
			{"before": true,
			"after": true}
		],
		"space-before-blocks": [ // there must be space before a block. e.g. " {"
			"error",
			"always"
		],
		"object-curly-spacing": [ // there is no spacing after '{' and before '}'
			"error",
			"never"
		],
		"no-trailing-spaces": "error", // no trailing whitespace
		"comma-style": [ // comma must always be placed at the end of the line
						 // e.g.: var foo = 1,
						 //           bar = 2;
			"error",
			"last"
		],
		"comma-spacing":[ // no space before and "one or more" space after commas
			"error",
			{"before": false,
			"after": true}
		],		
		"space-before-function-paren": [ // disallows any space followed by the '(' (function parenthesis) 	
										 // of arguments
			"error",
			"never"
		],
		"space-in-parens": [ // no space inside parenthesis. e.g. foo(x, y, z)
			"error",
			"never"
		],
		
		// 5) VARIABLES
		// 5.1) Naming
		"more-naming-conventions/snake-case-variables": [ //naming convention: snake_case
			"error",
			"always"
		],
		// 5.2) Nesting
		"no-shadow": [
			"error", // no variable declaration shadowing variables declared in outer scope
			{"hoist": "all"}
		],
		"no-dupe-args": "error", // no duplicate variable names for parameters of a function
		// 5.3) Comments
		"multiline-comment-style": [ // Disallows consecutive line comments and from having a "*" character before each line.
			"error",
			"bare-block"
		],
		
		// OTHERS
		"no-undef": "off",
		"no-redeclare": "off",
		"no-unused-vars": "off",
		"no-unused-labels": "off",
		
		"array-bracket-spacing": [ // there is no spacing after '[' and before ']'
			"error",
			"never"
		],		
		"func-call-spacing": [ // disallow space between function call and its opening parenthesis
			"error", 
			"never"
		],
        "semi": [ // requires semicolons at the end of statements
            "error",
            "always"
        ],
		"semi-spacing": [ // requires no space before semicolons and space after semicolons
			"error", 
			{"before": false,
			"after": true}
		]
    }
};