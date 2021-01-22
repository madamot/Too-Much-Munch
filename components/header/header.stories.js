import React from 'react';

import Header from './header';

export default {
  title: 'Header',
  component: Header,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Header  />;

export const Primary = Template.bind({});
