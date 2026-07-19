const {Router} = require('express')

const interviewController = require('../controllers/interview.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/file.middleware')

const interviewRouter =  Router();


/**
 * -@route /api/ianterview/generate-report
 * @description generate a structured report on interview based on user resume, self description and job description
 * @access Private
 */
interviewRouter.post('/generate-report', authMiddleware.authUser,upload.single("resume"),interviewController.interviewReportGenerationController);

module.exports = interviewRouter;