import React from 'react';

import Header from './header';

export default {
  title: 'Header',
  component: Header,
};

const Template = (args) => <Header {...args} />;

export const Logged_Out = Template.bind({});
Logged_Out.args = {
  isAuthenticated: false,
};

export const Logged_In = Template.bind({});
Logged_In.args = {
  isAuthenticated: true,
  isLoading: false,
};
