function State() {
    let state = {
        display: '0',
        operand: '0',
        operator: null,
        resetFlag: true,
        memory: '0'
    }

    const getState = () => state

    const validateValue = (value) => {
        if (isNaN(value)) {
            return;
        } else if (value.length > 12) {
            return parseFloat(value).toExponential(6).toString();
        } else {
            return value;
        }
    };

    const getDisplay = () => state.display;
    const setDisplay = (value) => state.display = validateValue(value) || state.display;

    const addDisplay = (value) => {
        if (state.display === '0' || state.resetFlag) {
            state.display = '';
            state.resetFlag = false;
        }

        return setDisplay(state.display + value);
    }

    const refreshDisplay = () => {
        document.querySelector('.display span').innerText = state.display;
        document.querySelector('.operator').innerText = state.operator
    }

    const setOperator = (value) => {
        state.operator = value;
        state.operand = state.display;
        state.resetFlag = true;
    }
    const getOperator = () => state.operator

    const setReset = (value) => state.resetFlag = value;
    const getReset = () => state.resetFlag;

    const setMemory = (value) => state.memory = value;
    const getMemory = () => state.memory;

    const setOperand = (value) => state.operand = value;
    const getOperand = () => state.operand;

    const doOperation = () => {
        const a = parseFloat(state.operand),
            b = parseFloat(state.display),
            operator = state.operator;

        state.operator = null;
        state.resetFlag = true;

        switch (operator) {
            case '+': return setDisplay(String(a + b));
            case '-': return setDisplay(String(a - b));
            case '*': return setDisplay(String(a * b));
            case '/': return setDisplay(String(a / b));
            case '^': return setDisplay(String(a ** b));
            case '√': return setDisplay(String(Math.sqrt(a)));
            case '³√': return setDisplay(String(Math.cbrt(a)));
        }
    }

    refreshDisplay();

    return {
        getState,
        getDisplay, setDisplay,
        addDisplay,
        refreshDisplay,
        getOperator, setOperator,
        getReset, setReset,
        getMemory, setMemory,
        getOperand, setOperand,
        doOperation
    }
}

const state = State();

const handleCommand = (event) => {
    const command = event.target.innerText;

    switch (command) {
        case '0':
            handleZero(); break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            state.addDisplay(command); break;
        case '.':
            handleDot(); break;
        case '+':
        case '*':
        case '/':
        case '^':
        case '√':
        case '³√':
            handleBasicOperator(command); break;
        case '-':
            handleMinus(); break;
        case '=': 
            handleEquals(); break;
        case 'M+':
            handleMPlus(); break;
        case 'M-':
            handleMMinus(); break;
        case 'MRC':
            handleMRC(); break;
        case 'MC':
            handleMC(); break;
        case 'OFF':
            return handleOff();
        case 'ON':
            handleOn(); break;
        case 'C/CE':
            handelCCE(); break;
        case '⌫':
            handleBackspace(); break;
        default:
            return;
    }

    state.refreshDisplay();

    console.log(JSON.stringify(state.getState(), null, 1));
}

function handleZero() {
    if(state.getDisplay().charAt(0) === '0') {
        return false;
    } else {
        return state.addDisplay('0');
    }
}

function handleDot() {
    if(state.getDisplay().includes('.')) {
        return false;
    } else {
        return state.addDisplay('.')
    }
}

function handleBasicOperator(operator) {
    if (state.getOperator()) {
        state.doOperation();
    }

    state.setOperator(operator);
}

function handleMinus() {
    if (state.getReset() === true) {
        state.addDisplay('-');
    } else {
        state.setOperator('-');
    }
}

function handleEquals() {
    state.doOperation();
}

function handleMPlus() {
    state.setMemory(state.getMemory() + parseFloat(state.getDisplay()));
    state.setDisplay('0');
    state.setReset(true);
}

function handleMMinus() {
    state.setMemory(state.getMemory() - parseFloat(state.getDisplay()));
    state.setDisplay('0');
    state.setReset(true);
}

function handleMRC() {
    state.setDisplay(state.getMemory());
}

function handleMC() {
    state.setMemory('0');
}

function handleOff() {
    document.querySelector('.keyboard').removeEventListener('click', handleCommand);
    state.setDisplay('0');
    document.querySelector('.display span').innerHTML = '';
}

function handelCCE() {
    if(state.getDisplay() === '0') {
        state.setOperand('0');
        state.setOperator(null);
    } else {
        state.setDisplay('0');
    }
}

function handleBackspace() {
    const display = state.getDisplay();
    if(display === '0') {
        return;
    }

    state.setDisplay(display.slice(0, -1) || '0');
}

function handleOn() {
    document.querySelector('.keyboard').addEventListener('click', handleCommand);
}

document.querySelector('#on').addEventListener('click', handleOn);
handleOn();