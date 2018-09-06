import React, { Component } from "react";

class SessionForm extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      code: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const user = Object.assign({}, this.state);
  };
}

export default SessionForm;
