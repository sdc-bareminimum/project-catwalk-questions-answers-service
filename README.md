# System Design Capstone

## Questions & Answers

### List Questions

GET /qa/questions

> Retrieves a list of questions for a particular product. This list does not include any reported questions.

Parameters

Parameter | Type | Description
-|-|-
product_id|integer|Specifies the product for which to retrieve questions.
count|integer|Specifies how many results per page to return. Default 5.

Response

**Status: 200 OK**
```
{
    "product_id": "43617",
    "results": [
        {
            "question_id": 153634,
            "question_body": "Iure quis iure vel veritatis sequi repudiandae et consequuntur voluptates.",
            "question_date": "2020-05-10T07:00:00.000Z",
            "reported": 0,
            "asker_name": "Larue13",
            "question_helpfulness": 26,
            "answers": {
                "299980": {
                    "id": 299980,
                    "body": "Enim nam aut.",
                    "date": "2020-12-25T08:00:00.000Z",
                    "answerer_name": "Damion85",
                    "helpfulness": 11,
                    "photos": []
                },
                "299981": {
                    "id": 299981,
                    "body": "Accusantium quibusdam eos illum aperiam numquam iste at doloremque qui.",
                    "date": "2021-04-04T07:00:00.000Z",
                    "answerer_name": "Filiberto70",
                    "helpfulness": 13,
                    "photos": []
                }
            }
        },
        // ...
    ]
}
```

---

### Answers List

GET /qa/questions/:question_id/answers

> Returns answers for a given question. This list _does not_ include any reported answers.

Parameters

Parameter | Type | Description
-|-|-
question_id|integer|Required ID of the question for wich answers are needed

Query Parameters

Parameter | Type | Description
-|-|-
count|integer|Specifies how many results per page to return. Default 5.

Response

**Status: 200 OK**
```
{
  "question": "1",
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```
---

### Add a Question

POST /qa/questions

> Adds a question for the given product

Body Parameters

Parameter | Type | Description
-|-|-
body|text|Text of question being asked
name|text|Username for question asker
email|text|Email address for question asker
product_id|integer|Required ID of the Product for which the question is posted

Response

**Status: 201 CREATED**

---

### Add an Answer

POST /qa/questions/answers

> Adds an answer for the given question

Query Parameters

Parameter | Type | Description
-|-|-
question_id|integer|Required ID of the question to post the answer for

Body Parameters

Parameter | Type | Description
-|-|-
body|text|Text of question being asked
name|text|Username for answerer
email|text|Email address for answerer
photos|[text]|An array of urls corresponding to images to display

Response

**Status: 201 CREATED**

---

### Mark Question as Helpful

PUT /qa/questions/:question_id/helpful

> Updates a question to show it was found helpful.

Parameters

Parameter | Type | Description
-|-|-
question_id|integer|Required ID of the question to update

Response

**Status: 204 NO CONTENT**

---

### Report Question

PUT /qa/questions/:question_id/report

> Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

Parameters

Parameter | Type | Description
-|-|-
question_id|integer|Required ID of the question to update

Response

**Status: 204 NO CONTENT**

---

### Mark Answer as Helpful

PUT /qa/questions/answers/:answer_id/helpful

> Updates an answer to show it was found helpful.

Parameters

Parameter | Type | Description
-|-|-
answer_id|integer|Required ID of the answer to update

Response

**Status: 204 NO CONTENT**

---

### Report Question

PUT /qa/questions/answers/:answer_id/report

> Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.

Parameters

Parameter | Type | Description
-|-|-
answer_id|integer|Required ID of the answer to update

Response

**Status: 204 NO CONTENT**
