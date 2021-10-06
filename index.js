const express = require('express');
const app = express();
const pool = require('./db/db.js');
const path = require('path');
const LOADER= path.resolve(__dirname, 'loaderio-429bcc53681bda4b57557a18756292ef.txt');

app.use('/loaderio-429bcc53681bda4b57557a18756292ef.txt', express.static(LOADER);
app.use(express.json());

// get all questions
app.get('/qa/questions', async (req, res) => {
  try {
    let product_id = req.query.product_id;
    let count = (req.query.count || 5);
    let page = (req.query.page || 1);

    const allQuestions = await pool.query(`
      SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, answers
      FROM questions_and_answers
      WHERE product_id IN (${product_id})
      ORDER BY question_helpfulness DESC
      LIMIT ${count}
      OFFSET ${(page - 1) * count}
      `);

    const productQuestions = {
      product_id: product_id,
      results: allQuestions.rows
    }

    res.json(productQuestions);
  } catch (err) {
    res.sendStatus(400);
  }
})

//get answers
app.get(`/qa/questions/:question_id/answers`, async (req, res) => {
  try {
    let page = (req.query.page || 1);
    let count = (req.query.count || 5);
    let question_id = req.params.question_id;

    const getAnswers = await pool.query(
      `SELECT answer_id, body, date, answerer_name, helpfulness, photos
      FROM answers_and_photos
      WHERE question_id IN (${question_id})
      ORDER BY helpfulness DESC
      LIMIT ${count}
      OFFSET ${(page - 1) * count}
      `)

      const productAnswers = {
        question: question_id,
        page: page,
        count: count,
        results: getAnswers.rows
      }

      res.json(productAnswers);

  } catch (err) {
    res.sendStatus(400)
  }
})

// post question
app.post(`/qa/questions`, async (req, res) => {
  try {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let questionDate = (year + '-' + month + '-' + date);

    const maxId = await pool.query(`SELECT MAX(question_id) FROM "Questions"`);

    const postQuestion = await pool.query(`INSERT INTO "Questions" (question_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, product_id) VALUES (${maxId.rows[0].max + 1},' ${req.body.body}', '${questionDate}', '${req.body.name}', '${req.body.email}', 0, false, ${req.body.product_id})`)

    const postQuestionsAndAnswers = await pool.query(`INSERT INTO questions_and_answers (question_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, product_id, answers)
    VALUES (${maxId.rows[0].max + 1},' ${req.body.body}', '${questionDate}', '${req.body.name}', '${req.body.email}', 0, false, ${req.body.product_id}, '{}'::json)`)

    res.json(201);
  } catch (err) {
    res.sendStatus(400);
  }
})

// post answer
app.post(`/qa/questions/:question_id/answers`, async (req, res) => {
  try {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let answerDate = (year + '-' + month + '-' + date);

    const maxAnswerId = await pool.query(`SELECT MAX(answer_id) FROM "Answers"`);

    const postAnswer = await pool.query(`INSERT INTO "Answers" (answer_id, question_id, body, date, answerer_name, answerer_email, helpfulness, reported) VALUES (${maxAnswerId.rows[0].max + 1}, ${req.params.question_id},'${req.body.body}', '${answerDate}', '${req.body.name}', '${req.body.email}', 0, false)`)

    for (var i = 0; i < req.body.photos.length; i++) {
      let photo = req.body.photos[i];
      console.log(req.body.photos[i])
      let maxPhotoId = await pool.query(`SELECT MAX(id) FROM "Photos"`);
      let postPhoto = await pool.query(`INSERT INTO "Photos" (id, answer_id, url) VALUES (${maxPhotoId.rows[0].max + 1}, ${maxAnswerId.rows[0].max}, ${photo})`);
    }

    const postAnswerAndPhotos = await pool.query(`INSERT INTO answers_and_photos (answer_id, question_id, body, date, answerer_name, answerer_email, helpfulness, reported, photos) VALUES (${maxAnswerId.rows[0].max + 1}, ${req.params.question_id},'${req.body.body}', '${answerDate}', '${req.body.name}', '${req.body.email}', 0, false, COALESCE((SELECT ARRAY_AGG(json_build_object('id', id, 'url', url)) FROM "Photos" WHERE answer_id = ${maxAnswerId.rows[0].max + 1}), ARRAY[]::json[])); `);

    res.json(201);
  } catch (err) {
    res.sendStatus(400);
  }
})

// question helpfulness
app.put(`/qa/questions/:question_id/helpful`, async (req, res) => {
  try {
    const questionHelpfulness = await pool.query(`SELECT question_helpfulness FROM "Questions" WHERE question_id = ${req.params.question_id}`);

    const markQuestionHelpful = await pool.query(`UPDATE "Questions" SET question_helpfulness = ${questionHelpfulness.rows[0].question_helpfulness + 1} WHERE question_id = ${req.params.question_id}`);

    const markQuestionAndAnswerHelpful = await pool.query(`UPDATE questions_and_answers SET question_helpfulness = ${questionHelpfulness.rows[0].question_helpfulness + 1} WHERE question_id = ${req.params.question_id}`)
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})

// question reported
app.put('/qa/questions/:question_id/report', async (req, res) => {
  try {
    const markQuestionReported = await pool.query(`UPDATE "Questions" SET reported = true WHERE question_id = ${req.params.question_id}`);

    const removeFromQuestionAndAnswer= await pool.query(`DELETE FROM questions_and_answers WHERE question_id = ${req.params.question_id}`);

    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})

// answer helpfulness
app.put(`/qa/answers/:answer_id/helpful`, async (req, res) => {
  try {
    const answerHelpfulness = await pool.query(`SELECT helpfulness FROM "Answers" WHERE answer_id = ${req.params.answer_id}`);

    const markQuestionHelpful = await pool.query(`UPDATE "Answers" SET helpfulness = ${answerHelpfulness.rows[0].helpfulness + 1} WHERE answer_id = ${req.params.answer_id}`);

    const markQuestionAndAnswersHelpful = await pool.query(`UPDATE answers_and_photos SET helpfulness = ${answerHelpfulness.rows[0].helpfulness + 1} WHERE answer_id = ${req.params.answer_id}`);

    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})

// answer reported
app.put('/qa/answers/:answer_id/report', async (req, res) => {
  try {
    const markAnswerReported = await pool.query(`UPDATE "Answers" SET reported = true WHERE answer_id = ${req.params.answer_id}`);

    const removeFromAnswersAndPhotos = await pool.query(`DELETE FROM answers_and_photos WHERE answer_id = ${req.params.answer_id}`)

    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
})
