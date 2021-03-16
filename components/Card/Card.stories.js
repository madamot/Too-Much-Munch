import React from 'react';

import Card from './Card';

export default {
  title: 'Recipe',
  component: Card,
};

const Template = (args) => <Card {...args} />;

export const Recipe = Template.bind({});
Recipe.args = {
  children: 'battered cod',
  display: 'card',
  state: 'recipe'
};

export const Add = Template.bind({});
Add.args = {
  children: 'battered cod',
  display: 'card',
  state: 'add'
};

export const List = Template.bind({});
List.args = {
  children: 'battered cod',
  display: 'list',
  state: 'recipe'
};
