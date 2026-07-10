const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');

const watsonxService = require('../src/services/watsonx.service');

test('generateText throws a formatted error when the primary model is unsupported', async () => {
  const originalPost = axios.post;

  watsonxService.getAccessToken = async () => 'fake-token';
  watsonxService.modelId = 'meta-llama/llama-3-3-70b-instruct';

  axios.post = async () => {
    const error = new Error('unsupported model');
    error.response = {
      status: 404,
      data: {
        errors: [{ code: 'model_not_supported' }],
      },
    };
    throw error;
  };

  try {
    await assert.rejects(
      async () => {
        await watsonxService.generateText('hello', 'system prompt');
      },
      {
        message: /Watsonx API error \(404\):/,
      }
    );
  } finally {
    axios.post = originalPost;
  }
});

test('generateText throws a formatted error when the service is unavailable', async () => {
  const originalPost = axios.post;

  watsonxService.getAccessToken = async () => 'fake-token';
  watsonxService.modelId = 'meta-llama/llama-3-3-70b-instruct';

  axios.post = async () => {
    const error = new Error('service unavailable');
    error.response = {
      status: 503,
      data: {
        errors: [{ code: 'service_unavailable' }],
      },
    };
    throw error;
  };

  try {
    await assert.rejects(
      async () => {
        await watsonxService.generateText('hello', 'system prompt');
      },
      {
        message: /Watsonx API error \(503\):/,
      }
    );
  } finally {
    axios.post = originalPost;
  }
});

