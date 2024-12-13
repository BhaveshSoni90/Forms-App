import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import axios from 'axios';

const ViewFormsScreen = ({ navigation }) => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    axios.get('https://your-api-url.com/forms')
      .then(response => {
        setForms(response.data);
      })
      .catch(error => {
        console.error('Error fetching forms:', error);
      });
  }, []);

  return (
    <View>
      {forms.map((form, index) => (
        <Button
          key={index}
          title={form.formName}
          onPress={() => navigation.navigate('FillForm', { formId: form._id })}
        />
      ))}
    </View>
  );
};

export default ViewFormsScreen;
