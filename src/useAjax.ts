import { useState, useEffect } from 'react';
import catchify from 'catchify';
import superagent from 'superagent';

export interface UseAjaxArgs {
  url: string;
  method?: string;
  headers?: any;
  data?: any;
  parser?: Function;
}

export default function useAjax({
  url,
  method = 'get',
  headers = {},
  data = {},
  parser = (res: any) => res
}: UseAjaxArgs): [Error | null, any] {
  const [result, setResult] = useState([null, null]);

  const makeRequest = async () => {
    setResult([null, null]);
    const req = useAjax.options.ajaxFn({ url, method, headers, data });

    const [err, res] = await catchify(req);
    if (err) {
      return setResult([err, null]);
    }

    try {
      console.log(parser(res));
      setResult([null, parser(res)]);
    } catch (e) {
      setResult([e, null]);
    }
  };

  useEffect(
    () => {
      makeRequest();
    },
    [url, method, JSON.stringify(headers), JSON.stringify(data)]
  );

  return result;
}

useAjax.options = {
  ajaxFn: async ({ url, method, headers, data }) => {
    const req = superagent[method](url);

    if (headers) {
      req.set(headers);
    }

    if (data) {
      if (method === 'get') {
        req.query(data);
      } else if (method === 'post') {
        req.send(data);
      }
    }

    const res = await req;
    return res.text;
  }
};
