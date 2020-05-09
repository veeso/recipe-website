import React, { useState } from "react";
import { Button, Container, Col, Form, Row, Toast } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from "prop-types";

import { subscribeNewsletter } from "../../../actions/newsletterActions";

function NewsletterForm(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [toastVisible, showToast] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastBody, setToastBody] = useState('');

  const subscribeToNewsletter = (ev) => {
    ev.preventDefault();
    dispatch(subscribeNewsletter(email)).then(() => {
      //Show Toast success
      setToastTitle(props.intl.formatMessage({id: "home.footer.newsletter.subscriptionSuccessTitle"}));
      setToastBody(props.intl.formatMessage({id: "home.footer.newsletter.subscriptionSuccessBody"}));
      setEmail('');
      showToast(true);
    }).catch(() => {
      setToastTitle(props.intl.formatMessage({id: "home.footer.newsletter.subscriptionErrorTitle"}));
      setToastBody(props.intl.formatMessage({id: "home.footer.newsletter.subscriptionErrorBody"}));
      showToast(true);
    });
  };

  return (
    <Container fluid>
      <Toast show={toastVisible} onClose={() => showToast(false)}>
        <Toast.Header>
          <strong className="mr-auto">{toastTitle}</strong>
        </Toast.Header>
        <Toast.Body style={{color: "#101010"}}>
          {toastBody}
        </Toast.Body>
      </Toast>
      <Form>
        <Row>
          <Col style={{ paddingLeft: 0 }} xs={8}>
            <Form.Group controlId="newsletterForm">
              <Form.Control type="email" placeholder={props.intl.formatMessage({id: "home.footer.newsletter.email"})} value={email} onChange={(ev) => setEmail(ev.currentTarget.value)} />
            </Form.Group>
          </Col>
          <Col style={{ paddingLeft: 0 }} xs={4}>
            <Button variant="success" type="submit" onClick={(ev) => subscribeToNewsletter(ev)}>
              <FormattedMessage id="home.footer.newsletter.signup" />
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

NewsletterForm.propTypes = {
  newsletterSubscription: PropTypes.bool,
};

export default injectIntl(NewsletterForm);
