import { User } from "../models";

export const roleSwitch = async (req, res) => {
  const {
    body: { role },
    user: { _id },
  } = req;
  try {
    const roles = ["agent", "consumer", "builder"];
    let combinations = {};
    if (req.user.secondaryRole) {
      const user = await User.findOneAndUpdate(
        { _id },
        {
          $set: { role: req.user.secondaryRole, secondaryRole: req.user.role },
        },
        { new: true }
      );
      return res.status(201).json({ message: "Updated Role", user });
    } else if (!req.user.secondaryRole) {
      combinations = {
        consumer: ["agent", "builder"],
        agent: ["builder"],
        builder: ["consumer", "agent"],
      };
    }

    const newRoles = combinations[req.user.role];
    if (!roles.includes(role))
      return res.status(401).json({ message: "Incorrect Role" });
    if (!newRoles.includes(role))
      return res
        .status(401)
        .json({ message: "This role switch is not permitted" });
    const user = await User.findOneAndUpdate(
      { _id },
      {
        $set: { role, secondaryRole: req.user.role },
      },
      { new: true }
    );
    res.status(201).json({ message: "Updated Role", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
