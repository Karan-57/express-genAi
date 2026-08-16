const {Router} = require('express')

const interviewController = require('../controllers/interview.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/file.middleware')

const interviewRouter =  Router();


/**
 * -@route /api/interview/generate-report
 * @description generate a structured report on interview based on user resume, self description and job description
 * @access Private
 */
interviewRouter.post('/generate-report', authMiddleware.authUser,upload.single("resume"),interviewController.interviewReportGenerationController);

/**
 * -@route /api/interview/get-report/:interviewId
 * @description get a report based on interview id/report id
 * @access Private
 */
interviewRouter.get('/get-report/:interviewId',authMiddleware.authUser,interviewController.getReportController);

/**
 * -@route /api/interview/get-all
 * @description get all reports of a user
 * @access Private
 */
interviewRouter.get('/get-all',authMiddleware.authUser,interviewController.getAllReportsController);


/**
 * -@route /api/interview/generate-resume/:interviewId
 * @description generate a resume for a particular job description based on previous resume and self description
 * @access Private
 */
interviewRouter.get('/generate-resume/:interviewId',authMiddleware.authUser,interviewController.generateResumeController);

module.exports = interviewRouter;
