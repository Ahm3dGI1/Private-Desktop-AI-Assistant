const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const process = require('process');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

GITHUB_TOKEN = process.env.GITHUB_TOKEN;