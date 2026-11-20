import JSEncrypt from 'jsencrypt'
import aes from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'
import padPkcs7 from 'crypto-js/pad-pkcs7'
import modeEcb from 'crypto-js/mode-ecb'
import { utils as aesUtils, ModeOfOperation as aesModeOfOperation } from 'aes-js'
import pako from 'pako'

const aesKey = encUtf8.parse(getAK())
const imgKey = getIK()

// @ts-ignore
// prettier-ignore
function getAK() {
  // function fn() { return 'tMlIRsJaGyNwdfik'; }
  let _0xodm = 'jsjiami.com.v7';
  function _0x78fd(_0x4f70d7, _0x16b8ed) { const _0x426832 = _0x4268(); return _0x78fd = function (_0x78fd15, _0x18feed) { _0x78fd15 = _0x78fd15 - 0x195; let _0x2c6cdf = _0x426832[_0x78fd15]; if (_0x78fd['wzXTXq'] === undefined) { const _0x4bc94f = function (_0x44a786) { const _0x124f55 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x4dc566 = '', _0x1ea3c9 = ''; for (var _0x4004df = 0x0, _0x54c3de, _0x31aa67, _0x25bf99 = 0x0; _0x31aa67 = _0x44a786['charAt'](_0x25bf99++); ~_0x31aa67 && (_0x54c3de = _0x4004df % 0x4 ? _0x54c3de * 0x40 + _0x31aa67 : _0x31aa67, _0x4004df++ % 0x4) ? _0x4dc566 += String['fromCharCode'](0xff & _0x54c3de >> (-0x2 * _0x4004df & 0x6)) : 0x0){ _0x31aa67 = _0x124f55['indexOf'](_0x31aa67); } for (let _0x1eb40f = 0x0, _0x2662e3 = _0x4dc566['length']; _0x1eb40f < _0x2662e3; _0x1eb40f++){ _0x1ea3c9 += '%' + ('00' + _0x4dc566['charCodeAt'](_0x1eb40f)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x1ea3c9); }; const _0x4b5361 = function (_0x376977, _0x391a18) { let _0x1d6389 = [], _0x69c218 = 0x0, _0x51fe11, _0x4e48fb = ''; _0x376977 = _0x4bc94f(_0x376977); let _0x4dc7be; for (_0x4dc7be = 0x0; _0x4dc7be < 0x100; _0x4dc7be++){ _0x1d6389[_0x4dc7be] = _0x4dc7be; } for (_0x4dc7be = 0x0; _0x4dc7be < 0x100; _0x4dc7be++){ _0x69c218 = (_0x69c218 + _0x1d6389[_0x4dc7be] + _0x391a18['charCodeAt'](_0x4dc7be % _0x391a18['length'])) % 0x100, _0x51fe11 = _0x1d6389[_0x4dc7be], _0x1d6389[_0x4dc7be] = _0x1d6389[_0x69c218], _0x1d6389[_0x69c218] = _0x51fe11; } _0x4dc7be = 0x0, _0x69c218 = 0x0; for (let _0x1dcb37 = 0x0; _0x1dcb37 < _0x376977['length']; _0x1dcb37++){ _0x4dc7be = (_0x4dc7be + 0x1) % 0x100, _0x69c218 = (_0x69c218 + _0x1d6389[_0x4dc7be]) % 0x100, _0x51fe11 = _0x1d6389[_0x4dc7be], _0x1d6389[_0x4dc7be] = _0x1d6389[_0x69c218], _0x1d6389[_0x69c218] = _0x51fe11, _0x4e48fb += String['fromCharCode'](_0x376977['charCodeAt'](_0x1dcb37) ^ _0x1d6389[(_0x1d6389[_0x4dc7be] + _0x1d6389[_0x69c218]) % 0x100]); } return _0x4e48fb; }; _0x78fd['sWfbVl'] = _0x4b5361, _0x4f70d7 = arguments, _0x78fd['wzXTXq'] = !![]; } const _0x10ccce = _0x426832[0x0], _0x7beb90 = _0x78fd15 + _0x10ccce, _0x575974 = _0x4f70d7[_0x7beb90]; return !_0x575974 ? (_0x78fd['AcTVLi'] === undefined && (_0x78fd['AcTVLi'] = !![]), _0x2c6cdf = _0x78fd['sWfbVl'](_0x2c6cdf, _0x18feed), _0x4f70d7[_0x7beb90] = _0x2c6cdf) : _0x2c6cdf = _0x575974, _0x2c6cdf; }, _0x78fd(_0x4f70d7, _0x16b8ed); } function _0x4268() { const _0xfdeee5 = (function () { return [_0xodm, 'tYkjBsnjXitIWadLmMi.gDcyoMum.RvnrG7QRMPR==', 'iSkqqCkqwCk9WPu', 'W5hcK8k4gSkWrCkjW4VcGCkRW5X9', 'rSkbrCkCW642rIWqWR/cQf4', 'dtZdQYhdJSkIDW', 'WOKja8kjWP0MA1HsnIBcMW', 'gSogW6ddQmo4zSojkW'].concat((function () { return ['gM4xEmoZW47cJGmpoxLZ', 'zmofWO1TzSkmFqH8mCkohW', 'WORdJwpdICoPnXrtBHm1WRa', 'l8kywaeuWR3dMmkWW7tcPSkyta', 'W4VcTJ7cTmkdFr98AIaRWR0WWOlcGa4', 'j8kschz2W6JdH8kT', 'wSkzW6GRhe93ucNdQYa2', 'WOv1o8kEWRCuhuZdTr7cR8kW'].concat((function () { return ['W6f0WP7dVH/cJCoAWOuYpSotWQ0', 'y8ocW4SqlSoizHC', 'x8kDWQXsxG10AW', 'j8ktxWmxWR7dH8kaW5tcQmk7sW', 'WQa9eYrCW4mYWRuOW4m1WPS']; }())); }())); }()); _0x4268 = function () { return _0xfdeee5; }; return _0x4268(); }; (function (_0xa1257b, _0x26ce43, _0x55fa85, _0x3d2796, _0xeb907a, _0x2968e2, _0x3b7564) { return _0xa1257b = _0xa1257b >> 0x6, _0x2968e2 = 'hs', _0x3b7564 = 'hs', function (_0x5bfe41, _0x57e3da, _0x4d061b, _0x436d22, _0x5d6ece) { const _0x3ef814 = _0x78fd; _0x436d22 = 'tfi', _0x2968e2 = _0x436d22 + _0x2968e2, _0x5d6ece = 'up', _0x3b7564 += _0x5d6ece, _0x2968e2 = _0x4d061b(_0x2968e2), _0x3b7564 = _0x4d061b(_0x3b7564), _0x4d061b = 0x0; const _0xb2af3d = _0x5bfe41(); while (!![] && --_0x3d2796 + _0x57e3da) { try { _0x436d22 = parseInt(_0x3ef814(0x19a, 'k@p6')) / 0x1 * (parseInt(_0x3ef814(0x197, 'jOk#')) / 0x2) + parseInt(_0x3ef814(0x19c, 'nF*l')) / 0x3 + -parseInt(_0x3ef814(0x195, '^hcD')) / 0x4 + -parseInt(_0x3ef814(0x19d, 'Ju$w')) / 0x5 + parseInt(_0x3ef814(0x1a0, 'rj9d')) / 0x6 * (parseInt(_0x3ef814(0x1a4, 'rj9d')) / 0x7) + parseInt(_0x3ef814(0x1a2, 'Az1k')) / 0x8 + -parseInt(_0x3ef814(0x199, 'w%)3')) / 0x9 * (parseInt(_0x3ef814(0x1a1, 'YM%G')) / 0xa); } catch (_0x4e5526) { _0x436d22 = _0x4d061b; } finally { _0x5d6ece = _0xb2af3d[_0x2968e2](); if (_0xa1257b <= _0x3d2796) _0x4d061b ? _0xeb907a ? _0x436d22 = _0x5d6ece : _0xeb907a = _0x5d6ece : _0x4d061b = _0x5d6ece; else { if (_0x4d061b == _0xeb907a['replace'](/[WyQPtgILdMGXRDBuYnrk=]/g, '')) { if (_0x436d22 === _0x57e3da) { _0xb2af3d['un' + _0x2968e2](_0x5d6ece); break; } _0xb2af3d[_0x3b7564](_0x5d6ece); } } } } }(_0x55fa85, _0x26ce43, function (_0x43fa60, _0x26fe8c, _0x277144, _0x33c8a9, _0xe82ff0, _0x19e17b, _0x403173) { return _0x26fe8c = '\x73\x70\x6c\x69\x74', _0x43fa60 = arguments[0x0], _0x43fa60 = _0x43fa60[_0x26fe8c](''), _0x277144 = '\x72\x65\x76\x65\x72\x73\x65', _0x43fa60 = _0x43fa60[_0x277144]('\x76'), _0x33c8a9 = '\x6a\x6f\x69\x6e', (0x179d07, _0x43fa60[_0x33c8a9]('')); }); }(0x30c0, 0x24333, _0x4268, 0xc5), _0x4268) && (_0xodm = 0x48fe); function fn() { const _0x10f923 = _0x78fd, _0x69c218 = { 'quEFq': _0x10f923(0x19e, 'nF*l') }; return _0x69c218['quEFq']; }
  return fn()
}

// @ts-ignore
// prettier-ignore
function getIK() {
  // function fn() { return '0123456789123456'; }
  const _0xodj = 'jsjiami.com.v7';
  function _0x24b8(_0x186941, _0x1a3fbb) { const _0x4af82d = _0x4af8(); return _0x24b8 = function (_0x24b84e, _0x264822) { _0x24b84e = _0x24b84e - 0x6c; let _0x41ddc1 = _0x4af82d[_0x24b84e]; if (_0x24b8['fHAayI'] === undefined) { const _0x346e16 = function (_0x528a24) { const _0x20b5f3 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; let _0x1c04de = '', _0x366a02 = ''; for (var _0x201238 = 0x0, _0x451a85, _0x3f8a57, _0x4ada67 = 0x0; _0x3f8a57 = _0x528a24['charAt'](_0x4ada67++); ~_0x3f8a57 && (_0x451a85 = _0x201238 % 0x4 ? _0x451a85 * 0x40 + _0x3f8a57 : _0x3f8a57, _0x201238++ % 0x4) ? _0x1c04de += String['fromCharCode'](0xff & _0x451a85 >> (-0x2 * _0x201238 & 0x6)) : 0x0){ _0x3f8a57 = _0x20b5f3['indexOf'](_0x3f8a57); } for (let _0x1b2074 = 0x0, _0x314bd1 = _0x1c04de['length']; _0x1b2074 < _0x314bd1; _0x1b2074++){ _0x366a02 += '%' + ('00' + _0x1c04de['charCodeAt'](_0x1b2074)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0x366a02); }; const _0x2f753c = function (_0x10d544, _0x1e6679) { let _0xbad9dc = [], _0x979add = 0x0, _0x1210aa, _0x3c0de5 = ''; _0x10d544 = _0x346e16(_0x10d544); let _0x1d7307; for (_0x1d7307 = 0x0; _0x1d7307 < 0x100; _0x1d7307++){ _0xbad9dc[_0x1d7307] = _0x1d7307; } for (_0x1d7307 = 0x0; _0x1d7307 < 0x100; _0x1d7307++){ _0x979add = (_0x979add + _0xbad9dc[_0x1d7307] + _0x1e6679['charCodeAt'](_0x1d7307 % _0x1e6679['length'])) % 0x100, _0x1210aa = _0xbad9dc[_0x1d7307], _0xbad9dc[_0x1d7307] = _0xbad9dc[_0x979add], _0xbad9dc[_0x979add] = _0x1210aa; } _0x1d7307 = 0x0, _0x979add = 0x0; for (let _0x231b97 = 0x0; _0x231b97 < _0x10d544['length']; _0x231b97++){ _0x1d7307 = (_0x1d7307 + 0x1) % 0x100, _0x979add = (_0x979add + _0xbad9dc[_0x1d7307]) % 0x100, _0x1210aa = _0xbad9dc[_0x1d7307], _0xbad9dc[_0x1d7307] = _0xbad9dc[_0x979add], _0xbad9dc[_0x979add] = _0x1210aa, _0x3c0de5 += String['fromCharCode'](_0x10d544['charCodeAt'](_0x231b97) ^ _0xbad9dc[(_0xbad9dc[_0x1d7307] + _0xbad9dc[_0x979add]) % 0x100]); } return _0x3c0de5; }; _0x24b8['yiLRPu'] = _0x2f753c, _0x186941 = arguments, _0x24b8['fHAayI'] = !![]; } const _0xb109d9 = _0x4af82d[0x0], _0x4ca390 = _0x24b84e + _0xb109d9, _0x55648d = _0x186941[_0x4ca390]; return !_0x55648d ? (_0x24b8['gbjrGN'] === undefined && (_0x24b8['gbjrGN'] = !![]), _0x41ddc1 = _0x24b8['yiLRPu'](_0x41ddc1, _0x264822), _0x186941[_0x4ca390] = _0x41ddc1) : _0x41ddc1 = _0x55648d, _0x41ddc1; }, _0x24b8(_0x186941, _0x1a3fbb); } function _0x4af8() { const _0x4426d9 = (function () { return [_0xodj, 'HejtUsrJwjDiXGpaBmi.lDdcDSyoWJmGP.RJvw7q==', 'bmo2W6JdMJPCWOqIp0xcGgSg', 'yCo3g8oNW4/dHCkVzmoom1LN', 'W4feWPVdUXJdHCoNadn9ESkeWOq', 'WOGIlSkIW5FcUGJdLuaaWQrOxa', 'W7HyfmkJgdvc', 'WQqzoSkQh8k0WPBdVmowC0j8'].concat((function () { return ['WR5gWPDSWQW7hSoJWPhdImonWQa8', 'W6qcW7pcNq7dNCk8WQVdPG', 'WPFdPGyvmCoKlSkOxq', 'WP/dRmoIALqyCdZcSY1grSkw', 'kdBdKZlcVSk0WPi', 'CmoGvI7dP3pdJM/cL2K', 'n8oQwSkfqq', 'amkChSkBW4tcShe'].concat((function () { return ['W6CcW7FdR0VcSCo6WOtdGHm5WOD2', 'WR7dOuK1WPxcOZRcQ2dcICkAAW', 'kdBdRmooWRpdHSorW71Znq', 'uNTSFmkBW51u', 'bSo3W6VdMZTBWOCbi2JcO3Os', 'WOhcQmkYWQnNvSk5', 'bCkuj8k6W5/cPLi']; }())); }())); }()); _0x4af8 = function () { return _0x4426d9; }; return _0x4af8(); }; if (function (_0x280768, _0x3800df, _0x26f2a5, _0xdb164a, _0x3d23d1, _0x4d264f, _0x3fbe92) { return _0x280768 = _0x280768 >> 0x3, _0x4d264f = 'hs', _0x3fbe92 = 'hs', function (_0x48a337, _0x40b96a, _0x1d8b10, _0x16fd80, _0x450951) { const _0x54491f = _0x24b8; _0x16fd80 = 'tfi', _0x4d264f = _0x16fd80 + _0x4d264f, _0x450951 = 'up', _0x3fbe92 += _0x450951, _0x4d264f = _0x1d8b10(_0x4d264f), _0x3fbe92 = _0x1d8b10(_0x3fbe92), _0x1d8b10 = 0x0; const _0x12536f = _0x48a337(); while (!![] && --_0xdb164a + _0x40b96a) { try { _0x16fd80 = parseInt(_0x54491f(0x70, 'XK7A')) / 0x1 * (parseInt(_0x54491f(0x73, 'Im^$')) / 0x2) + -parseInt(_0x54491f(0x77, 'fn[&')) / 0x3 * (parseInt(_0x54491f(0x7f, 'Gc(%')) / 0x4) + -parseInt(_0x54491f(0x7e, '*d4M')) / 0x5 + parseInt(_0x54491f(0x78, 'hFvM')) / 0x6 + -parseInt(_0x54491f(0x79, 'rjr&')) / 0x7 * (parseInt(_0x54491f(0x71, 'p]2q')) / 0x8) + -parseInt(_0x54491f(0x80, 'qi)V')) / 0x9 * (-parseInt(_0x54491f(0x6f, 'ph&H')) / 0xa) + parseInt(_0x54491f(0x6c, 'ph&H')) / 0xb; } catch (_0x50d1c6) { _0x16fd80 = _0x1d8b10; } finally { _0x450951 = _0x12536f[_0x4d264f](); if (_0x280768 <= _0xdb164a) _0x1d8b10 ? _0x3d23d1 ? _0x16fd80 = _0x450951 : _0x3d23d1 = _0x450951 : _0x1d8b10 = _0x450951; else { if (_0x1d8b10 == _0x3d23d1['replace'](/[HePRGXtUdqJwplDyBWrS=]/g, '')) { if (_0x16fd80 === _0x40b96a) { _0x12536f['un' + _0x4d264f](_0x450951); break; } _0x12536f[_0x3fbe92](_0x450951); } } } } }(_0x26f2a5, _0x3800df, function (_0x59f697, _0x32aea8, _0xb4f0c3, _0xbb9230, _0x199b00, _0x535ae9, _0x5a7446) { return _0x32aea8 = '\x73\x70\x6c\x69\x74', _0x59f697 = arguments[0x0], _0x59f697 = _0x59f697[_0x32aea8](''), _0xb4f0c3 = '\x72\x65\x76\x65\x72\x73\x65', _0x59f697 = _0x59f697[_0xb4f0c3]('\x76'), _0xbb9230 = '\x6a\x6f\x69\x6e', (0x179d0b, _0x59f697[_0xbb9230]('')); }); }(0x638, 0x4204a, _0x4af8, 0xc9), _0x4af8) { } function fn() { const _0x29a1a1 = _0x24b8, _0x979add = { 'oAjqg': '0123456789123456' }; return _0x979add[_0x29a1a1(0x7b, 'mSat')]; }
  return fn()
}

let rsaInstance: JSEncrypt | null
function getRSAInstance() {
  if (rsaInstance) return rsaInstance

  const ena = [
    '-',
    '-',
    '-',
    'E',
    'I',
    ' ',
    'U',
    'L',
    'C',
    'K',
    'Y',
    '-',
    '-',
    'M',
    'G',
    'M',
    '0',
    'C',
    'q',
    'S',
    'b',
    'D',
    'E',
    'A',
    'U',
    'A',
    'G',
    'A',
    'C',
    'i',
    'K',
    'g',
    'C',
    'O',
    'Z',
    'w',
    'A',
    't',
    'w',
    '8',
    'I',
    'b',
    'i',
    'p',
    'M',
    'G',
    'I',
    '8',
    'X',
    '+',
    'D',
    'x',
    'a',
    'w',
    'X',
    'V',
    'p',
    '9',
    'C',
    '8',
    'W',
    'g',
    'X',
    'V',
    'F',
    'i',
    '1',
    '9',
    'Z',
    '5',
    'w',
    'd',
    'k',
    'T',
    'q',
    'V',
    'I',
    'U',
    'o',
    'Y',
    'l',
    '7',
    'o',
    'H',
    '5',
    'D',
    'N',
    '/',
    'z',
    'w',
    'I',
    '2',
    'V',
    '3',
    'P',
    'J',
    'J',
    'R',
    'r',
    'h',
    'N',
    'Q',
    'g',
    'L',
    '1',
    'r',
    'n',
    'V',
    'S',
    'm',
    'v',
    '4',
    'l',
    'Q',
    'I',
    'h',
    'f',
    'a',
    'I',
    'A',
    'A',
    '-',
    '-',
    '-',
    'N',
    ' ',
    'U',
    'L',
    'C',
    'K',
    'Y',
    '-',
    '-'
  ]
  const enb = [
    '-',
    '-',
    'B',
    'G',
    'N',
    'P',
    'B',
    'I',
    ' ',
    'E',
    '-',
    '-',
    '-',
    'I',
    'f',
    'A',
    'G',
    'S',
    'G',
    'I',
    '3',
    'Q',
    'B',
    'Q',
    'A',
    '4',
    'N',
    'D',
    'B',
    'Q',
    'B',
    'Q',
    'U',
    's',
    'l',
    '5',
    'Z',
    'E',
    'N',
    'G',
    'p',
    '1',
    'k',
    'K',
    'f',
    '4',
    'r',
    'A',
    't',
    'E',
    'F',
    'i',
    'U',
    'T',
    'P',
    '6',
    'T',
    'a',
    'U',
    'G',
    'v',
    'Y',
    'Q',
    'a',
    'z',
    'q',
    '4',
    '8',
    '4',
    'U',
    'L',
    'B',
    'j',
    'f',
    '0',
    'D',
    '1',
    '0',
    'V',
    'Q',
    'H',
    'B',
    'J',
    'g',
    'y',
    'C',
    'b',
    '4',
    'Z',
    'Z',
    'u',
    '/',
    'v',
    'C',
    'u',
    'K',
    'Q',
    'D',
    'b',
    'W',
    '9',
    'P',
    '3',
    'p',
    'c',
    'q',
    'y',
    'Q',
    'V',
    '0',
    '0',
    '7',
    'q',
    'Z',
    '9',
    'f',
    'h',
    'Q',
    'D',
    'Q',
    'B',
    '-',
    '-',
    'E',
    'D',
    'P',
    'B',
    'I',
    ' ',
    'E',
    '-',
    '-',
    '-'
  ]

  let rsaKey = ''
  for (let i = 0, j = Math.min(ena.length, enb.length); i < j; i++) {
    rsaKey += ena[i] + enb[i]
  }

  rsaInstance = new JSEncrypt()
  rsaInstance.setPublicKey(rsaKey)
  return rsaInstance
}

export function encryptByRSA(content: string) {
  if (!content) return ''

  try {
    return getRSAInstance().encrypt(content)
  } catch (error) {
    return ''
  }
}

export function encryptByAES(content: string) {
  if (!content) return ''

  try {
    return aes
      .encrypt(content, aesKey, {
        mode: modeEcb,
        padding: padPkcs7
      })
      .toString()
  } catch (error) {
    return ''
  }
}

export function decryptByAES(content: string) {
  if (!content) return ''

  try {
    return aes
      .decrypt(content, aesKey, {
        mode: modeEcb,
        padding: padPkcs7
      })
      .toString(encUtf8)
  } catch (error) {
    return ''
  }
}

// @ts-ignore
// prettier-ignore
export function paramsSign() {
  // p=params
  // u=url
  // s=store
  // a=genSignTime tsg 执行后的结果（当前时间戳精确到秒）
  // b=ObjectToQueryString
  // c=genSignPrefixKey kpsg
  // d=deviceId
  // e=genSignKey ksg
  // f=genSign sg
  // g=uid
  // function fn(p, u, s, ap1) {
  //   const a = ap1[0];
  //   const b = ap1[1];
  //   const ap2 = ap1[2]();
  //   const c = ap2[0];
  //   const x = s['env'] === 'browser';
  //   const d = ap2[1];
  //   const ap3 = ap2[2]();
  //   const e = ap2[3];
  //   const f = ap3[0];
  //   const g = ap3[1];
  //   return f(c(x ? u : u + 'x9', function(){ return a() + (s['env'].length - 7) * 1000 }), b, () => [d, () => [g, p], e], s['version']);
  // }
  let _0xodP='jsjiami.com.v7';function _0x525e(_0x2c08cb,_0x4d706a){const _0x483d7d=_0x483d();return _0x525e=function(_0x525e93,_0x346f61){_0x525e93=_0x525e93-0xbf;let _0x28c9db=_0x483d7d[_0x525e93];if(_0x525e['qjFSZW']===undefined){const _0x4267f1=function(_0x36c25c){const _0x2bbd4e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1d34a7='',_0x41481c='';for(let _0x303389=0x0,_0x411439,_0x36e589,_0x1a3d09=0x0;_0x36e589=_0x36c25c['charAt'](_0x1a3d09++);~_0x36e589&&(_0x411439=_0x303389%0x4?_0x411439*0x40+_0x36e589:_0x36e589,_0x303389++%0x4)?_0x1d34a7+=String['fromCharCode'](0xff&_0x411439>>(-0x2*_0x303389&0x6)):0x0){_0x36e589=_0x2bbd4e['indexOf'](_0x36e589);}for(let _0x487a01=0x0,_0x2be5a1=_0x1d34a7['length'];_0x487a01<_0x2be5a1;_0x487a01++){_0x41481c+='%'+('00'+_0x1d34a7['charCodeAt'](_0x487a01)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x41481c);};const _0x11f45a=function(_0x47ef06,_0x2279a2){let _0x27a4e5=[],_0x49c5bc=0x0,_0x226733,_0x853f3c='';_0x47ef06=_0x4267f1(_0x47ef06);let _0xf800b6;for(_0xf800b6=0x0;_0xf800b6<0x100;_0xf800b6++){_0x27a4e5[_0xf800b6]=_0xf800b6;}for(_0xf800b6=0x0;_0xf800b6<0x100;_0xf800b6++){_0x49c5bc=(_0x49c5bc+_0x27a4e5[_0xf800b6]+_0x2279a2['charCodeAt'](_0xf800b6%_0x2279a2['length']))%0x100,_0x226733=_0x27a4e5[_0xf800b6],_0x27a4e5[_0xf800b6]=_0x27a4e5[_0x49c5bc],_0x27a4e5[_0x49c5bc]=_0x226733;}_0xf800b6=0x0,_0x49c5bc=0x0;for(let _0x413916=0x0;_0x413916<_0x47ef06['length'];_0x413916++){_0xf800b6=(_0xf800b6+0x1)%0x100,_0x49c5bc=(_0x49c5bc+_0x27a4e5[_0xf800b6])%0x100,_0x226733=_0x27a4e5[_0xf800b6],_0x27a4e5[_0xf800b6]=_0x27a4e5[_0x49c5bc],_0x27a4e5[_0x49c5bc]=_0x226733,_0x853f3c+=String['fromCharCode'](_0x47ef06['charCodeAt'](_0x413916)^_0x27a4e5[(_0x27a4e5[_0xf800b6]+_0x27a4e5[_0x49c5bc])%0x100]);}return _0x853f3c;};_0x525e['PlvUnh']=_0x11f45a,_0x2c08cb=arguments,_0x525e['qjFSZW']=!![];}const _0x3bd7ed=_0x483d7d[0x0],_0x50802c=_0x525e93+_0x3bd7ed,_0x1ced39=_0x2c08cb[_0x50802c];return!_0x1ced39?(_0x525e['PwIpUT']===undefined&&(_0x525e['PwIpUT']=!![]),_0x28c9db=_0x525e['PlvUnh'](_0x28c9db,_0x346f61),_0x2c08cb[_0x50802c]=_0x28c9db):_0x28c9db=_0x1ced39,_0x28c9db;},_0x525e(_0x2c08cb,_0x4d706a);}(function(_0x43df20,_0x5a557f,_0xe1b367,_0x526c1f,_0x19801f,_0x455d16,_0x7975c){return _0x43df20=_0x43df20>>0x7,_0x455d16='hs',_0x7975c='hs',function(_0x3e9a4b,_0x3b8254,_0x9b60a5,_0x53fb01,_0x34108c){const _0x5c1e15=_0x525e;_0x53fb01='tfi',_0x455d16=_0x53fb01+_0x455d16,_0x34108c='up',_0x7975c+=_0x34108c,_0x455d16=_0x9b60a5(_0x455d16),_0x7975c=_0x9b60a5(_0x7975c),_0x9b60a5=0x0;const _0x20e124=_0x3e9a4b();while(!![]&&--_0x526c1f+_0x3b8254){try{_0x53fb01=parseInt(_0x5c1e15(0xc6,'$gY]'))/0x1*(-parseInt(_0x5c1e15(0xc0,']94i'))/0x2)+-parseInt(_0x5c1e15(0xd3,'4Qnq'))/0x3+parseInt(_0x5c1e15(0xd2,'$87Q'))/0x4*(-parseInt(_0x5c1e15(0xc7,'g2@V'))/0x5)+-parseInt(_0x5c1e15(0xd6,'4mAd'))/0x6*(parseInt(_0x5c1e15(0xcc,'[cHM'))/0x7)+-parseInt(_0x5c1e15(0xc8,'Wp9s'))/0x8+parseInt(_0x5c1e15(0xcb,'zqNp'))/0x9+parseInt(_0x5c1e15(0xc5,'g2@V'))/0xa;}catch(_0x543bc5){_0x53fb01=_0x9b60a5;}finally{_0x34108c=_0x20e124[_0x455d16]();if(_0x43df20<=_0x526c1f)_0x9b60a5?_0x19801f?_0x53fb01=_0x34108c:_0x19801f=_0x34108c:_0x9b60a5=_0x34108c;else{if(_0x9b60a5==_0x19801f['replace'](/[HGknALVxJlEQOtrfRBF=]/g,'')){if(_0x53fb01===_0x3b8254){_0x20e124['un'+_0x455d16](_0x34108c);break;}_0x20e124[_0x7975c](_0x34108c);}}}}}(_0xe1b367,_0x5a557f,function(_0x1c65bb,_0x1d0273,_0x159c22,_0x31d887,_0x282fab,_0x2fd736,_0x549706){return _0x1d0273='\x73\x70\x6c\x69\x74',_0x1c65bb=arguments[0x0],_0x1c65bb=_0x1c65bb[_0x1d0273](''),_0x159c22='\x72\x65\x76\x65\x72\x73\x65',_0x1c65bb=_0x1c65bb[_0x159c22]('\x76'),_0x31d887='\x6a\x6f\x69\x6e',(0x17a190,_0x1c65bb[_0x31d887](''));});}(0x6400,0x22963,_0x483d,0xca),_0x483d)&&(_0xodP=_0x483d);function _0x483d(){const _0x17e871=(function(){return[_0xodP,'VVljBsLOjirErakmGJiV.cFQoOmtr.fvn7QRAHxV==','zXilW6zwxuFdUG','yCoGyJXf','WOVcI1pdTMq','W4JcJCkJsSo8','W6DEq2avWR/dGMBdRMvbW7y','w8kCi8oZWRDoWOm','W4NdH1FdGhdcKSkMW4K','W7GuW7BcIsONpGCnhMSF'].concat((function(){return['baBcQSkzda','CspcS0xdJW','W6PjW4VcRuFdRHtdNSkAW5WnWPa','W5jnldjdWQdcPSkwW4VdLeS0','qwRcN3FcPSkdWO3dSGNdGqhdRSov','yHzjWO5mm8o0BW','qtVdJHldPmoXW6C','e3VdNrRcPSkmW43dGrVcNwrU','wCklW7XGB8ohpSktybZcS8kRiq','W5PdW4q'].concat((function(){return['WQa3W77dNeq','W7tcImkJleZdQq4xW7CRWP8sWQW','ehNdNr3cR8knW43dOWZcV0bk','W73cGCkQkKZdQfulW5asWQu7','CLVdRYC8WQpdNmkYc8kSWQDlWOu','rtWvW71RpSk0','lCk0bIlcVmoUFW','wSkbW79MzmoinSk7rdBcQSkzfa'];}()));}()));}());_0x483d=function(){return _0x17e871;};return _0x483d();};function fn(_0x30a29f,_0x591f16,_0x537db2,_0x299f24){const _0x958466=_0x525e,_0x561b5a={'qzcoc':function(_0x13ecdc,_0x26f2cf){return _0x13ecdc+_0x26f2cf;},'EWeNs':function(_0x1d6436){return _0x1d6436();},'sqtlo':function(_0x4ad8fb,_0x46d541){return _0x4ad8fb-_0x46d541;},'ShVmX':_0x958466(0xc3,'VfUX'),'eRhMu':function(_0x2d198a,_0x1f8ecf){return _0x2d198a===_0x1f8ecf;},'NqmvT':function(_0x12716,_0x274e7b,_0x15ed02){return _0x12716(_0x274e7b,_0x15ed02);},'fBbvK':_0x958466(0xc9,'DBF6')},_0xf07848=_0x299f24[0x0],_0x43f88f=_0x299f24[0x1],_0x29c34f=_0x299f24[0x2](),_0x3ae10e=_0x29c34f[0x0],_0x2cd6b7=_0x561b5a['eRhMu'](_0x537db2[_0x561b5a[_0x958466(0xd5,'$gY]')]],_0x958466(0xca,'UO3%')),_0x3f31da=_0x29c34f[0x1],_0x8c06bc=_0x29c34f[0x2](),_0x3a893f=_0x29c34f[0x3],_0x4cd4f9=_0x8c06bc[0x0],_0x19a8e7=_0x8c06bc[0x1];return _0x4cd4f9(_0x561b5a[_0x958466(0xcf,'LXMR')](_0x3ae10e,_0x2cd6b7?_0x591f16:_0x591f16+'x9',function(){const _0x5b014e=_0x958466;return _0x561b5a[_0x5b014e(0xce,'$87Q')](_0x561b5a['EWeNs'](_0xf07848),_0x561b5a[_0x5b014e(0xd4,'w]5$')](_0x537db2[_0x561b5a[_0x5b014e(0xc4,'L@Lr')]]['length'],0x7)*0x3e8);}),_0x43f88f,()=>[_0x3f31da,()=>[_0x19a8e7,_0x30a29f],_0x3a893f],_0x537db2[_0x561b5a[_0x958466(0xcd,'PbK5')]]);}
  return fn
}

function wordArrayToUint8Array(words: number[], sigBytes: number) {
  if (sigBytes <= 0) return null

  const bin = new Uint8Array(Math.min(words.length * 4, sigBytes))

  words.forEach((item, index) => {
    const num = item < 0 ? item + 0x100000000 : item

    bin[index * 4 + 0] = (num >>> 24) & 0xff
    bin[index * 4 + 1] = (num >>> 16) & 0xff
    bin[index * 4 + 2] = (num >>> 8) & 0xff
    bin[index * 4 + 3] = (num >>> 0) & 0xff
  })

  return bin
}

export function decryptData(raw: string): { [key: string]: any } | null {
  if (!(raw || '').trim()) return null

  try {
    const decrypted = aes.decrypt(raw, aesKey, {
      mode: modeEcb,
      padding: padPkcs7
    })
    const uint8Array = wordArrayToUint8Array(decrypted.words, decrypted.sigBytes)

    if (!uint8Array) return null

    const inflatedData = pako.inflate(uint8Array)
    const uint16Array = new Uint16Array(inflatedData)
    const size = 8 * 1024
    const lastIndex = uint16Array.length - 1
    let buffer: number[] = []

    const data = uint16Array.reduce((res, item, index) => {
      buffer.push(item)

      if (buffer.length === size || index === lastIndex) {
        res += String.fromCharCode(...buffer)
        buffer = []
      }

      return res
    }, '')

    return JSON.parse(data || 'null')
  } catch (error) {
    console.error(error)
    return null
  }
}

let imgCryptoInstance: aesModeOfOperation.ModeOfOperationECB

function getImgCryptoInstance() {
  if (!imgCryptoInstance) {
    const keyBytes = aesUtils.utf8.toBytes(imgKey)
    imgCryptoInstance = new aesModeOfOperation.ecb(keyBytes)
  }

  return imgCryptoInstance
}

export async function decryptImg(url: string) {
  try {
    const response = await fetch(url)
    const encryptedData = await response.arrayBuffer()

    const decryptedBytes = getImgCryptoInstance().decrypt(new Uint8Array(encryptedData))

    const type = url.split('.bnc')[0].split('.').slice(-1)[0] || 'jpeg'

    return `data:image/${type};base64,` + aesUtils.utf8.fromBytes(decryptedBytes)
  } catch (error) {
    return ''
  }
}

export function getFormatTime(seconds: number): string {
  if (seconds < 0) {
    throw new Error('时间错误');
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
