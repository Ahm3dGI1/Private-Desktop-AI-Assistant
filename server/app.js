const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const ollamaService = require('./services/ollama');


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(bodyParser.json()); // For parsing incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }));