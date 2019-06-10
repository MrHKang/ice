import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Input, Form } from '@alifd/next';
import styles from './GitRemote.module.scss';

const FormItem = Form.Item;
const FormSubmit = Form.Submit;

function GitRemote({ onOk, remoteUrl: initRemoteUrl, submitMessage }) {
  const [remoteUrl, setRemoteUrl] = useState(initRemoteUrl);
  async function onSave(values, errors) {
    if (!errors) {
      await onOk(remoteUrl);
    }
  }

  async function onChange(value) {
    setRemoteUrl(value);
  }

  return (
    <Form>
      <FormItem
        required
        size="medium"
        label={<FormattedMessage id="iceworks.project.panel.git.remote.url.label" />}
        className={styles.item}
      >
        <Input
          name="remoteUrl"
          value={remoteUrl}
          onChange={onChange}
        />
      </FormItem>
      <FormSubmit onClick={onSave} validate type="primary" className={styles.button}>
        {submitMessage}
      </FormSubmit>
    </Form>
  );
}

GitRemote.defaultProps = {
  remoteUrl: '',
};

GitRemote.propTypes = {
  onOk: PropTypes.func.isRequired,
  remoteUrl: PropTypes.string,
  submitMessage: PropTypes.element.isRequired,
};

export default GitRemote;
