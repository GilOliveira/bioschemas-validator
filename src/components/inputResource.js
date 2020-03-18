import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button, InputGroup, FormControl, Row, Col, Spinner,
} from 'react-bootstrap';
import Octicon, { Globe, Code } from '@primer/octicons-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import CardGroup from './CardControlGroup';
import scraper from '../utils/webScraper';
import 'prismjs/components/prism-turtle';
import 'prismjs/themes/prism-coy.css';


class InputResource extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputUrl: 'https://www.flymine.org/flymine/begin.do',
      loading: false,
      onCodeChange: props.onCodeChange,
    };
  }

  onUrlChange = (inputUrl) => {
    this.setState({ inputUrl });
  };

  onCodeEdit = (newCode) => {
    const { onCodeChange, loading } = this.state;
    if (loading) {
      return;
    }
    onCodeChange(newCode);
  };

  onLoad = async () => {
    const { onCodeChange, inputUrl } = this.state;

    this.setState({ loading: true });

    const rdfCode = await scraper(inputUrl);
    this.setState({
      loading: false,
    }, () => onCodeChange(rdfCode));
  };

  render() {
    const { inputUrl, loading } = this.state;
    const { rdfCode } = this.props;
    const spinnerClass = 'pl-0' + (loading ? '' : ' invisible');
    const editorClass = 'border border-secondary' +
      (loading ? ' disabled-code' : '');

    const urlInputControl = (
      <Row>
        <Col>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-url-addon">
                <Octicon icon={Globe} ariaLabel="Web address input" />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              id="basic-url"
              placeholder="https://myurl.com/RDF_document"
              aria-describedby="basic-url-addon"
              value={inputUrl}
              onChange={this.onUrlChange}
            />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button disabled={loading} type="primary" onClick={this.onLoad}>Load</Button>
        </Col>
        <Col xs="auto" className={spinnerClass}>
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    );
    const codeInputControl = (
      <Editor
        className={editorClass}
        value={rdfCode}
        padding={10}
        onValueChange={this.onCodeEdit}
        highlight={(code) => highlight(code, languages.turtle)}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    );

    return (
      <CardGroup header="Structured Data" icon={Code} bodyTitle="Load from a web resource or directly edit the code below">
        <Fragment>
          {urlInputControl}
          {codeInputControl}
        </Fragment>
      </CardGroup>
    );
  }
}

InputResource.propTypes = {
  onCodeChange: PropTypes.func.isRequired,
  rdfCode: PropTypes.string.isRequired,
};

export default InputResource;
