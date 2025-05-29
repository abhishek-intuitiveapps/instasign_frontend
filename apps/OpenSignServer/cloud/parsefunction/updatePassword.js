

const updatePassword = async (request) => {
  try {
    const { new_password, email } = request.params;

    if (!new_password || !email) {
      return { message: 'Missing required parameters: new_password and email' };
    }

    // Find user by email
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo('email', email.toLowerCase());
    const user = await userQuery.first({ useMasterKey: true });

    if (!user) {
      return { message: 'User not found with the provided email' };
    }

    // Update password
    user.set('password', new_password);
    await user.save(null, { useMasterKey: true });

    // Log the password change
    console.log('Password updated for user:', email);

    return { 
      message: 'Password updated successfully',
      success: true,
      email: email
    };

  } catch (err) {
    console.log('Err in updatePassword:', err);
    return { 
      message: 'Failed to update password',
      success: false,
      error: err.message 
    };
  }
};

export default updatePassword; 