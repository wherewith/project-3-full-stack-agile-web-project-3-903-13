const db = require('../config/db')

const retrieveMenuItems = (req,res) => {
	db.query("SELECT * FROM menuitems", (err,results) => {
		if (err) {
			throw err
		}
		res.status(200).json(results.rows)
	})
}

const addMenuItem = (req, res) => {
    const { itemName, price, category } = req.body;
	db.query(
		"Select * from menuitems where itemName = $1", [itemName],
		(err, result) => {
			if (err){
				console.log(err);
				res.status(500);
				return;
			} else if (result.rows.length){
				res.status(401).send("Item Already exists");
				return;
			} else {
				db.query(
					'INSERT INTO menuitems (itemName, price, category) VALUES ($1, $2, $3)',
					[itemName, price, category],
					(err, result) => {
						if (err) {
							console.log(err);
							res.status(500);
							return;
						}
						res.status(201).send('Menu item added successfully');
					}
				);
			}
		}
	);
    
};

module.exports = {
	retrieveMenuItems,
	addMenuItem,

}
