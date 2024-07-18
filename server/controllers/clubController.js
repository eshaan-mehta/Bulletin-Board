const Club = require("../models/Club");
const Event = require("../models/Event")
const mongoose = require("mongoose");

const getClubPreviewsBasedOnFilters = async (req, res) => {
    const { name, genre, cost, size, showInactive } = req.query;

     // searches for name to match searched name, "i" = case insensitive
     const searchedName = name ? {
        $or: [ 
            { name: { $regex: name, $options: "i" } },
            // add parameters fields to search for here
        ]
    } : {};

    // ensure that the filters parameters are not undefined or null before adding them to the filters object
    let filters = {
        validation: true
    };
    if (genre) filters.genre = genre;
    if (cost >= 0) filters.cost = {$lte: cost};
    if (size >= 0) filters.size = {$lte: size};
    if (showInactive == "false") {
        filters.isActive = true; // only filter for active clubs
    } 

    try {
        const clubPreviewsList = await Club
                                    .find({ ...searchedName, ...filters })
                                    .select(" _id \
                                            name \
                                            overview \
                                            genre \
                                            cost \
                                            size \
                                            isActive \
                                            colorTheme")  // only select these fields to return
                                    .sort({ name: 1 });
                                    
        return res.status(200).json(clubPreviewsList);
    } catch (error) {
        console.error("Error retrieving club previews: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getClubDetails = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Club not found." });
    }

    const club = await Club.findById(id);

    if (!club) {
        return res.status(404).json({ error: "Club not found." });
    }

    return res.status(200).json(club);
};

const getClubEvents = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: "Club not found." });
	}

	try {
		const club = await Club.findById(id);

		if (!club) {
			return res.status(404).json({ error: "Club not found." });
		}

		const events = await Event.find({ belongsToClub: id })
			.select("_id title description tags preview createdAt updatedAt")
			.sort({ createdAt: -1 });

		return res.status(200).json(events);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const createClub = async (req, res) => {
    const {
    name,
    overview,
    description,
    genre,
    colorTheme,
    location,
    cost,
    meetingsFrequency,
    email,
    instagram,
    discord,
    facebook,
    apply_link,
    facts,
    } = req.body;

    const { userId } = req.auth;

    // commented out for now until testing is done
    // const existingClub = await Club.findOne({ owner: userId });
    // if (existingClub) {
    //     return res.status(400).json({ error: 'Can not own more than 1 club.' });
    // }

  let club;

    try {
        const logoBuffer = req.file ? req.file.buffer.toString('base64') : null;
        const extension = req.file ? `image/${req.file.originalname.split('.').pop()}` : null;

        club = await Club.create({
            name,
            overview,
            logo: {
            data: logoBuffer,
            extension: extension
            },
            description,
            genre,
            colorTheme,
            location,
            cost,
            meetingsFrequency,
            email,
            instagram,
            discord,
            facebook,
            apply_link,
            facts,
            owner: userId
        });

        res.status(201).json(club);
    } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const deleteClub = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Club not found." });
    }

    const club = await Club.findById(id);

    if (!club) {
        return res.status(404).json({ error: "Club not found." });
    }
    
    if (club.owner !== req.auth.userId) {
        return res.status(403).json({ error: "Can not delete a club you do not own." });
    }

    await club.deleteOne();

    await Event.deleteMany({ _id: { $in: club.events } })

    res.status(200).json(club);
};

const updateClub = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Club not found." });
    }

    try {
        const club = await Club.findById(id)

        if (!club) {
            return res.status(404).json({ error: "Club not found." });
        }

        if (club.owner !== req.auth.userId) {
            return res.status(403).json({ error: "Can not update a club you do not own." });
        }

        Object.assign(club, req.body);
        await club.save();

        res.status(200).json(club);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// const addFieldToAllEntries = async (req, res) => {
//     const { field, value } = req.body;

//     if (!field) {
//         return res.status(400).json({ error: "Field is required" });
//     }

//     try {
//         await Club.updateMany({}, { [field]: value });

//         res.status(200).json({ message: `Added ${field} to all entries` });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// const removeFieldFromAllEntries = async (req, res) => {
//     const { field } = req.body;

//     try {
//         await Club.updateMany({}, { $unset: { [field]: "" } });

//         res.status(200).json({ message: `Removed ${field} from all entries` });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }


module.exports = {
    getClubPreviewsBasedOnFilters,
    getClubDetails,
	getClubEvents,
    createClub,
    deleteClub,
    updateClub,
}