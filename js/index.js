let tokenBuffer = [];
let opBuffer = [];

let opPrecedence = new Object();
opPrecedence["+"] = 2;
opPrecedence["-"] = 2;
opPrecedence["*"] = 1;
opPrecedence["/"] = 1;

let res = 0;

function clean(){
    document.getElementById("inputNumber").value = "";
    tokenBuffer = []
    opBuffer = [];
}

function getNumber(){
    var numField = document.getElementById("inputNumber");
    var num = Number(numField.value);

    numField.value = "";
    
    return num;
}

function addOperationToBuffer(num, op){
    tokenBuffer.push(num);
    opBuffer.push(op);
}

function operation(op){
    var num = getNumber();

    if(num == NaN){
        return;
    }
    
    addOperationToBuffer(num, op);
}

function reset(){
    clean();

    document.getElementById("resultValue").value = "";
}

function applyOp(lhs, rhs, op){
    switch(op){
        case "+":
            return lhs + rhs;

        case "-":
            return lhs - rhs;
        
        case "*":
            return lhs * rhs;

        case "/":
            return lhs / rhs;
    }
}

function solveOps(tokens, ops){
    var opStack = [];
    var tokenStack = [];

    var topOp = "";

    var lhs = 0;
    var rhs = 0;

    for(idx in ops){
        if(ops[idx] == "RES"){
            tokenStack.push(tokens[idx]);

            while(opStack.length != 0){
                rhs = tokenStack.pop();
                lhs = tokenStack.pop();

                tokenStack.push(applyOp(lhs, rhs, opStack.pop()));
            }

            return tokenStack.pop();
        }

        if(opStack.length == 0)
        {
            tokenStack.push(tokens[idx]);
            opStack.push(ops[idx]);
            continue;
        }

        topOp = opStack.pop();
        opStack.push(topOp);

        if(opPrecedence[topOp] > opPrecedence[ops[idx]]){
            opStack.push(ops[idx]);

            tokenStack.push(tokens[idx]);
        }
        else {
            lhs = tokenStack.pop();
            rhs = tokens[idx];

            tokenStack.push(applyOp(lhs, rhs, opStack.pop()));
            opStack.push(ops[idx]);
        }
    }
}

function result(){
    var num = getNumber();

    var operationString = "";

    addOperationToBuffer(num, "RES");

    res = solveOps(tokenBuffer, opBuffer);

    operationString += String(tokenBuffer[0]) + " ";
    tokenBuffer.shift();

    for(idx in opBuffer){
        if(opBuffer[idx] != "RES"){
            operationString += opBuffer[idx] + " " + String(tokenBuffer[idx]) + " ";   
        }
    }

    operationString += "= " + res;

    document.getElementById("resultValue").value = String(res);
    document.getElementById("logInformation").value += "\n" + operationString;

    clean();
}
