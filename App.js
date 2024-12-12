import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const App = () => {
  const [formTitle, setFormTitle] = useState('');
  const [headerImage, setHeaderImage] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState(null);

  // Function to open image picker for header image
  const pickHeaderImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setHeaderImage(response.assets[0].uri); 
      }
    });
  };

  const pickQuestionImage = (index) => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const updatedQuestions = [...questions];
        updatedQuestions[index].imageUrl = response.assets[0].uri; // Set the URI of the selected question image
        setQuestions(updatedQuestions);
      }
    });
  };

  // Add a question of a specific type (text, checkbox, or grid)
  const addQuestion = (type) => {
    setQuestions([
      ...questions,
      { type, questionText: '', imageUrl: null, options: [] }
    ]);
  };

  // Handle saving the form
  const handleSave = async () => {
    const formData = {
      title: formTitle,
      headerImage,
      questions
    };
    setFormData(formData);
    Alert.alert('Form saved', 'Your form has been saved successfully!');
  };

  // Form Editor UI
  const FormEditor = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Form Builder</Text>

        {/* Form Title Input */}
        <TextInput
          style={styles.inputField}
          placeholder="Form Title"
          value={formTitle}
          onChangeText={setFormTitle}
        />

        {/* Header Image */}
        <TouchableOpacity onPress={pickHeaderImage} style={styles.imageButton}>
          <Text style={styles.buttonText}>Add Header Image</Text>
        </TouchableOpacity>
        {headerImage && (
          <Image source={{ uri: headerImage }} style={styles.imagePreview} />
        )}

        {/* Add Question Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => addQuestion('text')} style={styles.buttonBlue}>
            <Text style={styles.buttonText}>Add Text Question</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addQuestion('checkbox')} style={styles.buttonGreen}>
            <Text style={styles.buttonText}>Add Checkbox Question</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addQuestion('grid')} style={styles.buttonPurple}>
            <Text style={styles.buttonText}>Add Grid Question</Text>
          </TouchableOpacity>
        </View>

        {/* Questions List */}
        {questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Question Text"
              value={q.questionText}
              onChangeText={(text) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].questionText = text;
                setQuestions(updatedQuestions);
              }}
            />

            {/* Options Input for Grid/Checkbox */}
            {['checkbox', 'grid'].includes(q.type) && (
              <TextInput
                style={styles.inputField}
                placeholder="Options (comma-separated)"
                value={q.options.join(', ')}
                onChangeText={(text) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].options = text.split(',');
                  setQuestions(updatedQuestions);
                }}
              />
            )}

            {/* Image Picker for Question */}
            <TouchableOpacity
              onPress={() => pickQuestionImage(index)}
              style={styles.imageButton}>
              <Text style={styles.buttonText}>Add Question Image</Text>
            </TouchableOpacity>
            {q.imageUrl && (
              <Image source={{ uri: q.imageUrl }} style={styles.imagePreview} />
            )}
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.buttonBlueFullWidth}>
          <Text style={styles.buttonText}>Save Form</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Form Preview UI
  const FormPreview = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>{formData.title}</Text>

        {/* Header Image */}
        {formData.headerImage && (
          <Image source={{ uri: formData.headerImage }} style={styles.previewImage} />
        )}

        {/* Questions */}
        {formData.questions.map((q, index) => (
          <View key={index} style={styles.previewQuestion}>
            <Text style={styles.questionTitle}>{q.questionText}</Text>

            {/* Display image for question if exists */}
            {q.imageUrl && <Image source={{ uri: q.imageUrl }} style={styles.previewImage} />}
            
            {/* Display options for Checkbox or Grid questions */}
            {q.options && q.options.length > 0 && (
              <FlatList
                data={q.options}
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item }) => <Text style={styles.optionItem}>{item}</Text>}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.appContainer}>
      {formData ? (
        <FormPreview />
      ) : (
        <FormEditor />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  previewBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: 30,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionItem: {
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonBlue: {
    backgroundColor: '#3182ce',
    padding: 10,
    borderRadius: 5,
  },
  buttonGreen: {
    backgroundColor: '#48bb78',
    padding: 10,
    borderRadius: 5,
  },
  buttonPurple: {
    backgroundColor: '#9f7aea',
    padding: 10,
    borderRadius: 5,
  },
  buttonBlueFullWidth: {
    backgroundColor: '#3182ce',
    padding: 15,
    width: '100%',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  imageButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});

export default App;
