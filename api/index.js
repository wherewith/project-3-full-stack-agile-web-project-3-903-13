const express = require('express')
const app = express()
const PORT = 5000;

const db = require('./config/db')
db.connect()

/*
 * Make this query right when the server starts as it seems
 * the first query is slow, and subsequent queries run in reasonable time.
 * If there's a better way to do this, we should try to find it.
 * */
db.query("SELECT * FROM employees")

/*
	Use built-in JSON middleware so that incoming requests
	will have their bodies converted to JSON automatically.
*/

app.use(express.json())

// Handle requests with the express router
const menuItemsRouter = require('./routes/menuItems')
const transactionsRouter = require('./routes/transactions')
const ingredientsRouter = require('./routes/ingredients')
const inventoryRouter = require('./routes/inventory')
const foodItemsRouter = require('./routes/foodItems')
const employeesRouter = require('./routes/employees')

app.use("/api/menuitems", menuItemsRouter)
app.use("/api/transactions", transactionsRouter)
app.use("/api/ingredients", ingredientsRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/fooditems", foodItemsRouter)
app.use("/api/employees", employeesRouter)

app.listen(PORT, () => {
	console.log(`Listening on http://localhost:${PORT}`)
})