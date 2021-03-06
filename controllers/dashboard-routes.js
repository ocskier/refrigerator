const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Inventory, Category } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Inventory.findAll({
        // Display descending order by expiration date
        order: [['expiration_date', 'ASC']],
        where: {
            user_id: req.session.user_id
        },
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbInventoryData => {
        const inventories = dbInventoryData.map(inventory => inventory.get({ plain: true }));
        res.render('dashboard', {inventories, loggedin: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;