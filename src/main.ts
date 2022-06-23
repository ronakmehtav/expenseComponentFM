import data from '../data.json';

function createElement(type: keyof HTMLElementTagNameMap, options = {}) {
  const element = document.createElement(type);
  Object.entries(options).forEach(([key, value]) => {
    key = key.toLocaleLowerCase();
    if (key === 'class' || key === 'classname') {
      (value as string[]).forEach((value) => element.classList.add(value));
      return;
    }
    if (key === 'dataset') {
      Object.entries(value as object).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return;
    }
    if (key === 'text') {
      element.textContent = value as string;
      return;
    }
    if (value) element.setAttribute(key, value as string);
  });
  return element;
}

interface chartObj {
  day: string;
  amount: number;
  max?: string;
  height?: string;
}

generateChartObj(data);

function generateChartObj(inputData: chartObj[]) {
  let maxValueObj = getMaxObj(inputData);
  let data = getModifiedData(inputData, maxValueObj);
  const container = document.querySelector('.chart__collection'); //the Actual html element to put the blocks inside of.
  data
    .map((modifiedData: chartObj) => createChartBlock(modifiedData))
    .forEach((block) => {
      container?.append(block);
    });
}
//adding the data about max and height of the chart block
function getModifiedData(data: chartObj[], maxValueObj: chartObj) {
  data.map((dataBlock: chartObj) => {
    if (dataBlock.day === maxValueObj.day) {
      dataBlock.max = 'true';
      dataBlock.height = `10rem`;
    } else {
      dataBlock.max = 'false';
      dataBlock.height = `${Math.floor(
        (dataBlock.amount / maxValueObj.amount) * 10
      )}rem`;
    }
    return dataBlock;
  });
  return data;
}

function getMaxObj(data: chartObj[]) {
  return data.reduce((maxValue: chartObj, datablock: chartObj) => {
    if (datablock.amount > maxValue.amount) {
      return datablock;
    }
    return maxValue;
  }, data[0]);
}

function createChartBlock(blockData: chartObj): HTMLElement {
  let [day, amount, max, height] = [
    blockData.day,
    blockData.amount,
    blockData.max,
    blockData.height,
  ];
  let parentELm = createElement('div');
  let helpText = `For day name of ${day} the amount is $${amount}. ${
    max === 'true' ? 'This is the max expense.' : ''
  }`;

  let hiddenElm = createElement('p', {
    class: ['visually-hidden'],
    text: helpText,
  });

  parentELm.append(hiddenElm);

  let chartBlockContainer = createElement('div', {
    class: ['chartBlock__container'],
    'aria-hidden': 'true',
  });

  let chartBlock = createElement('div', {
    class: ['chartBlock'],
    dataset: { value: `$${amount}`, max: max },
    style: `--chartHeight:${height}`,
  });

  let dayblock = createElement('p', { text: day });

  chartBlockContainer.append(chartBlock, dayblock);
  parentELm.append(chartBlockContainer);
  return parentELm;
}
