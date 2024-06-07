const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./middleware/auth');
const { ingestCustomer, ingestOrder } = require('./controllers/ingestController');
const { checkAudienceSize, saveAudience } = require('./controllers/audienceController');
const { sendCampaign, updateDeliveryStatus } = require('./controllers/campaignController');

const app = express();
app.use(bodyParser.json());

app.post('/api/customers', authenticate, ingestCustomer);
app.post('/api/orders', authenticate, ingestOrder);
app.post('/api/audience/size', authenticate, checkAudienceSize);
app.post('/api/audience/save', authenticate, saveAudience);
app.post('/api/campaign/send', authenticate, sendCampaign);
app.post('/api/campaign/update-status', authenticate, updateDeliveryStatus);

app.listen(3000, () => console.log('Server running on port 3000'));
