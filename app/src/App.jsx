import CodeMirror from "@uiw/react-codemirror";
import React, { Component } from "react";
import { outputChange, submitting } from "./store/Actions/codeActions";
import { connect } from "react-redux";
import axios from "axios";
import Question from "./Components/Question/Question";
import classes from "./app.module.css";
import Result from "./Components/Result/Result";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/dracula.css";

class App extends Component {
  state = {
    lang: "cpp17",
    mode: "clike",
    value: `
#include <iostream>
using namespace std;

int main() {
    int x=10;
    cin>>x;
    cout<<x;
}
        `,
  };
  submitHandler = () => {
    this.props.submitting();
    const x = {
      code: this.state.value,
      input: this.props.input,
      lang: this.state.lang,
    };
    axios
      .post("/", x)
      .then((response) => {
        console.log(response.data.output);
        this.props.outputChange(response.data.output);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  render() {
    return (
      <>
        <div className={classes.header}>

            <div className={classes.heading}>Source Code</div>
          <div className={classes.run}>
            <div>
              <button
                className={classes.submit}
                onClick={() => this.submitHandler()}
              >
                Run
              </button>
            </div>
          </div>
        </div>
        <div className={classes.container}>
          <div className={classes.question}>
            <Question />
          </div>
          {/* <div className={classes.down}>GO DOWN!!!</div> */}
          <div className={classes.editor}>
            <CodeMirror
              value={this.state.value}
              onBeforeChange={(editor, data, value) => {
                this.setState({ value: value });
              }}
              options={{
                mode: this.state.mode,
                theme: "oneDark",
                lineNumbers: true,
                indentUnit: 4,
                indentWithTabs: true,
              }}
              autoCursor={true}
              onChange={(editor, data, value) => {}}
            />
          </div>
          <div className={classes.result}>
            <Result />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    input: state.code.input,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    outputChange: (output) => dispatch(outputChange(output)),
    submitting: () => dispatch(submitting()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
