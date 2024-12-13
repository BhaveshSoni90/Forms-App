import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

const FillFormScreen = ({ route }) => {
  const { formId } = route.params;
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    axios.get(`https://forms-backend-gac5.onrender.com/api/forms/${formId}`)
      .then(response => {
        setForm(response.data);
      })
      .catch(error => {
        console.error('Error fetching form:', error);
      });
  }, [formId]);

  const handleSubmit = () => {
    axios.post('https://forms-backend-gac5.onrender.com/api/responses', { formId, responses })
      .then(response => {
        console.log('Form response saved:', response.data);
      })
      .catch(error => {
        console.error('Error saving response:', error);
      });
  };

  if (!form) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>{form.formName}</Text>
      {form.questions.map((q, idx) => (
        <View key={idx}>
          <Text>{q.question}</Text>
          {/* Add form inputs for different types of questions */}
          {q.type === 'text' && (
            <TextInput
              placeholder="Your answer"
              value={responses[idx] || ''}
              onChangeText={(text) => setResponses({ ...responses, [idx]: text })}
            />
          )}
          {/* Handle radio/checkbox questions here */}
        </View>
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default FillFormScreen;
