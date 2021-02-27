import React from 'react';

import Card from './Card';

export default {
  title: 'Card',
  component: Card,
};

const Template = (args) => <Card {...args} />;

export const Recipe = Template.bind({});
Recipe.args = {
  children: 'battered cod',
  recipe: true,
};

export const Add = Template.bind({});
Add.args = {
  children: 'battered cod',
  add: true,
};
