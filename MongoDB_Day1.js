// Import the required MongoDB driver
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'mydatabase';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

// Connect to the MongoDB server
client.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    return;
  }

  // Create a new database
  const db = client.db(dbName);

  // Create the "profile" collection
  db.createCollection('profile', (err, collection) => {
    if (err) {
      console.error('Failed to create collection:', err);
      client.close();
      return;
    }

    console.log('Collection created: profile');

    // Define your profile data
    const myProfile = {
      name: 'Your Name',
      address: {
        street: '123 Main St',
        city: 'Cityville',
        state: 'State',
        country: 'Country'
      },
      hobbies: ['Reading', 'Coding', 'Traveling']
    };

    // Insert your profile into the "profile" collection
    db.collection('profile').insertOne(myProfile, (err, result) => {
      if (err) {
        console.error('Failed to insert profile:', err);
        client.close();
        return;
      }

      console.log('Profile inserted successfully');

      // Find your profile in the "profile" collection
      db.collection('profile').findOne({}, (err, profile) => {
        if (err) {
          console.error('Failed to find profile:', err);
          client.close();
          return;
        }

        console.log('Profile:', profile);

        // New address and hobbies data
        const newAddress = {
          street: '456 Elm St',
          city: 'Townsville',
          state: 'State',
          country: 'Country'
        };

        const newHobbies = ['Reading', 'Coding', 'Gaming'];

        // Update your profile in the "profile" collection
        db.collection('profile').updateOne(
          {},
          { $set: { address: newAddress, hobbies: newHobbies } },
          (err, result) => {
            if (err) {
              console.error('Failed to update profile:', err);
              client.close();
              return;
            }

            console.log('Profile updated successfully');

            // Delete your profile from the "profile" collection
            db.collection('profile').deleteOne({}, (err, result) => {
              if (err) {
                console.error('Failed to delete profile:', err);
                client.close();
                return;
              }

              console.log('Profile deleted successfully');
              client.close();
            });
          }
        );
      });
    });
  });
});
