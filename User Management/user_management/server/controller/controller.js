var Userdb = require('../model/model');
exports.create = async (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: 'Content cannot be empty' });
        return;
    }

    try {
        // Check if email already exists
        const existingUser = await Userdb.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // Create new user
        const user = new Userdb({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            status: req.body.status
        });

        // Save user in the database
        await user.save();
        res.redirect('/add-user');
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the user"
        });
    }
};




// retrieve and return all users/retrieve and return a single user
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id });
                } else {
                    res.send(data);
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving user with id " + id });
            });
    } else {
        // LIFO: Sort by `_id` in descending order (most recent first)
        Userdb.find()
            .sort({ _id: -1 }) // sorting by `_id` in descending order (newest first)
            .then(users => {
                res.send(users); // send sorted users
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error occurred while retrieving user information"
                });
            });
    }
}

// update user by id
exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update cannot be empty" });
    }
    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot update user with ${id}, Maybe user not found" });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating user information" });
        });
}

// delete user by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Cannot delete with id ${id}, Maybe id is wrong" });
            } else {
                res.send({
                    message: "User was deleted successfully"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id = " + id
            });
        });
}



