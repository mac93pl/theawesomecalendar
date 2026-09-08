import assert from 'node:assert/strict';
import test from 'node:test';

import { matchHoneypot } from '../lib/honeypots.ts';

test('recognizes the busiest probes, including nested WordPress installs and URL variants', () => {
  for (const pathname of [
    '/wp-admin/install.php',
    '/wp-login.php',
    '/index.php',
    '/xmlrpc.php',
    '/cms/wp-includes/wlwmanifest.xml',
    '/2019/wp-includes/wlwmanifest.xml',
    '/wp-json/batch/v1',
    '//wp-json/Batch/v1/',
    '/wordpress/wp-json/batch/v1',
    '/wp-json/gravitysmtp/v1/tests/mock-data',
    '/%77p-login.php',
  ]) {
    assert.equal(matchHoneypot(pathname)?.family, 'wordpress', pathname);
  }
  assert.deepEqual(matchHoneypot('//wp-json/Batch/v1/'), {
    path: '/wp-json/batch/v1',
    family: 'wordpress',
  });
  for (const pathname of [
    '/.env',
    '/api/.env',
    '/old/.env.production',
    '/%2eenv.local',
  ]) {
    assert.equal(matchHoneypot(pathname)?.family, 'environment', pathname);
  }
});

test('does not classify working pages, APIs, discovery files or legacy calendar downloads as traps', () => {
  for (const pathname of [
    '/',
    '/pl',
    '/en',
    '/pl/blog',
    '/en/blog/planning-projects',
    '/api/contact',
    '/api/checkout',
    '/_next/image',
    '/brand/drukarka.png',
    '/robots.txt',
    '/sitemap.xml',
    '/pl/robots.txt',
    '/llms.txt',
    '/ads.txt',
    '/produkt/the-awesome-calendar',
    '/wp-content/uploads/2016/12/linear-calendar-site-en.png',
    '/wp-content/uploads/2017/12/ry%C5%BC-demo-15m-2018.pdf',
    '/not-wp-admin/install.php',
    '/my.env',
    '/wp-json-guide',
    '/ordinary-404',
  ]) {
    assert.equal(matchHoneypot(pathname), null, pathname);
  }
});

test('rejects malformed, oversized and control-character paths without throwing', () => {
  for (const pathname of [
    '/%E0%A4%A',
    '/%GG',
    `/${'a'.repeat(260)}/.env`,
    '/wp-json/%0Aspoofed-log',
  ]) {
    assert.equal(matchHoneypot(pathname), null);
  }
});
