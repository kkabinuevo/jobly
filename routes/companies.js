const Router = require("express").Router;
const Company = require("../models/company");
const ExpressError = require("../helpers/expressError");
const { BAD_REQUEST } = require("../config");
const { validate } = require("jsonschema");
const companySchemaNew = require("../schemas/companySchemaNew.json")

const router = new Router();

/** GET /  - get full list of companies or
* list of companies matching passed in parameters.
* => {companies [{name, handle}, ...]}
*/
router.get("/", async function (req, res, next) {
    try {
        const { search, min_employees, max_employees } = req.body;
        if (min_employees > max_employees){
            throw new ExpressError ("Max employees should not be less than Min employees.", BAD_REQUEST);
        }
        const result = await Company.getAll({ search, min_employees, max_employees });
        return res.json({companies: result});
    } catch (err) {
        return next(err);
    }
});

router.post("/", async function (req, res, next) {
    try {
        const validation = validate(req.body, companySchemaNew);
        if (!validation.valid) {
            return next({
                status: 400,
                message: validation.errors.map(e => e.stack)
            });
        }
        const company = await Company.addCompany(req.body);

        return res.status(201).json({ company });
    } catch (err) {
        return next(err);
    }
});

router.get("/:handle", async function (req, res, next){
    try {
        const handle = req.params.handle;

        const company = await Company.getOneCompany(handle);

        if (!company) {
            return next({
                status: 404,
                message: "Company not found"
            });
        }

        return res.json({ company })

    } catch(err) {
        return next(err);
    }
});

module.exports = router;