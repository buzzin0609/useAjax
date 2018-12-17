import React from 'react';
import { render, waitForElement, cleanup } from 'react-testing-library';
import useAJAX from './useAjax';
import sinon from 'sinon';

describe('useAJAX', function() {
  let ajaxStub: any;

  function TextComponent() {
    const [err, result] = useAJAX({ url: 'test' });

    if (err) {
      return <p data-testid="error">{err.message}</p>;
    }

    if (result) {
      return <p data-testid="result">{result}</p>;
    }

    return <p>nothing</p>;
  }

  beforeEach(() => {
    ajaxStub = sinon.stub(useAJAX.options, 'ajaxFn').resolves({
      text: 'test'
    });
  });

  afterEach(() => {
    ajaxStub.restore();
    cleanup();
  });

  it('should call the ajaxFn', async function() {
    const { rerender } = render(<TextComponent />);
    rerender(<TextComponent />);
    // expect(getByTestId("result")).toBeTruthy();
    expect(ajaxStub.called).toEqual(true);
  });

  it('should return the request.text value on successful ajax request', async function() {
    const { getByTestId, rerender } = render(<TextComponent />);
    rerender(<TextComponent />);
    await waitForElement(() => getByTestId('result'));
    expect(getByTestId('result')).toBeTruthy();
  });
});
