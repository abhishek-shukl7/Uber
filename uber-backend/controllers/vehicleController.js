// controllers/vehicleController.js
const db = require('../config/mysql');

// ✅ Add Vehicle and update driver's vehicle_ids
exports.addVehicle = async (req, res) => {
  try {
    const { make, model, year, color, plate_number, capacity, vehicle_type } = req.body;
    const user_id = req.user?.user_id;
    const user_type = req.user?.user_type;

    if (user_type !== 'driver' && user_type !== 'super_admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    const [result] = await db.query(
      `INSERT INTO vehicles (make, model, year, color, plate_number, capacity, vehicle_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [make, model, year, color, plate_number, capacity, vehicle_type]
    );

    const vehicle_id = result.insertId;

    // Fetch current vehicle_ids for driver
    const [driverRows] = await db.query('SELECT vehicle_id FROM drivers WHERE user_id = ?', [user_id]);
    if (driverRows.length > 0) {
      let existing = driverRows[0].vehicle_id || '[]';
      let vehicles = [];
      try { vehicles = JSON.parse(existing); } catch { vehicles = []; }
      vehicles.push(vehicle_id);
      await db.query('UPDATE drivers SET vehicle_id = ? WHERE user_id = ?', [JSON.stringify(vehicles), user_id]);
    }

    res.status(201).json({ vehicle_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Vehicle creation failed' });
  }
};

// ✅ Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, color, plate_number, capacity, vehicle_type } = req.body;
    const user_type = req.user?.user_type;

    if (user_type !== 'driver' && user_type !== 'super_admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await db.query(
      `UPDATE vehicles SET make = ?, model = ?, year = ?, color = ?, plate_number = ?, capacity = ?, vehicle_type = ?
       WHERE vehicle_id = ?`,
      [make, model, year, color, plate_number, capacity, vehicle_type, id]
    );

    res.json({ msg: 'Vehicle updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Vehicle update failed' });
  }
};

// ✅ Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;
    const user_type = req.user?.user_type;

    if (user_type !== 'driver' && user_type !== 'super_admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Remove vehicle_id from driver's list
    const [driverRows] = await db.query('SELECT vehicle_id FROM drivers WHERE user_id = ?', [user_id]);
    if (driverRows.length > 0) {
      let vehicles = [];
      try { vehicles = JSON.parse(driverRows[0].vehicle_id || '[]'); } catch { vehicles = []; }
      vehicles = vehicles.filter(v => v !== parseInt(id));
      await db.query('UPDATE drivers SET vehicle_id = ? WHERE user_id = ?', [JSON.stringify(vehicles), user_id]);
    }

    await db.query('DELETE FROM vehicles WHERE vehicle_id = ?', [id]);
    res.json({ msg: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Vehicle deletion failed' });
  }
};
