import http from 'k6/http';
import { check, sleep } from 'k6';

const max = 1000011;
const min = 900010;
const rnd = Math.floor(Math.random() * (max - min + 1)) + min;

export default function () {
  let res = http.get(`http://localhost:3000/qa/questions/${rnd}/answers`);
  check(res, { 'status was 200': (r) => r.status == 200 });
  // sleep(1);
}

// http://localhost:3000/qa/questions/?product_id=${rnd} //questions
// const max = 1000011; const min = 900010;
// http://localhost:3000/qa/questions/${rnd}/answers //answers
// const max = 3518970; const min = 3167073;
