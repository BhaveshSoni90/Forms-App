import React, { useEffect, useState } from 'react';
import { View, Button, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ViewFormsScreen = ({ navigation }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the saved forms from the backend API
  useEffect(() => {
    axios.get('https://forms-backend-gac5.onrender.com/api/forms')  // Update this with your actual API URL
      .then(response => {
        setForms(response.data);  // Store the forms data in the state
        setLoading(false);  // Set loading to false once data is fetched
      })
      .catch(err => {
        setError('Error fetching forms. Please try again!');
        setLoading(false);  // Set loading to false even if there is an error
        console.error('Error fetching forms:', err);
      });
  }, []);

  // Render a loading spinner while the data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading forms...</Text>
      </View>
    );
  }

  // Handle error scenario
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Forms</Text>

      {/* Display list of forms */}
      <FlatList
        data={forms}
        keyExtractor={(item) => item._id} // Use unique ID for each form
        renderItem={({ item }) => (
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>{item.title}</Text>
            <Button
              title="Fill Form"
              onPress={() => navigation.navigate('FillForm', { formId: item._id })}
            />
          </View>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  formItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewFormsScreen;
