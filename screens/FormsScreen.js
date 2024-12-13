import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Used for selecting images

// Helper function to pick an image
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });
  return result.uri;
};

const FormsScreen = () => {
  const [formName, setFormName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState(null); // null until a type is selected
  const [options, setOptions] = useState([]);
  const [imageUri, setImageUri] = useState(null); // For question image
  const [optionImages, setOptionImages] = useState([]); // For images of options
  const [isQuestionTypeVisible, setIsQuestionTypeVisible] = useState(false);

  // Function to add a new question
  const handleAddQuestion = () => {
    if (!questionText || !questionType) return;

    setQuestions([
      ...questions,
      { question: questionText, type: questionType, options: options, questionImage: imageUri, optionImages: optionImages }
    ]);
    setQuestionText('');
    setOptions([]);
    setImageUri(null);
    setOptionImages([]);
    setQuestionType(null); // Reset question type after adding question
    setIsQuestionTypeVisible(false); // Hide question type options after adding
  };

  // Function to handle selecting an image for the question
  const addQuestionImage = async () => {
    const uri = await pickImage();
    setImageUri(uri);
  };

  // Function to handle adding an option
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  // Function to handle adding an image for an option
  const addOptionImage = async (index) => {
    const uri = await pickImage();
    const newOptionImages = [...optionImages];
    newOptionImages[index] = uri;
    setOptionImages(newOptionImages);
  };

  // Function to handle saving the form to the database
  const handleSaveForm = () => {
    // Assuming axios is set up for your API
    axios.post('https://your-api-url.com/forms', { formName, questions })
      .then(response => {
        console.log('Form saved:', response.data);
      })
      .catch(error => {
        console.error('Error saving form:', error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Form</Text>

      {/* Form Name */}
      <TextInput
        placeholder="Enter Form Name"
        value={formName}
        onChangeText={setFormName}
        style={styles.input}
      />

      {/* Add Question Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsQuestionTypeVisible(!isQuestionTypeVisible)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Show Question Type Options */}
      {isQuestionTypeVisible && (
        <View style={styles.questionTypeContainer}>
          <Text style={styles.subHeader}>Select Question Type:</Text>
          <View style={styles.buttonRow}>
            <Button title="Text" onPress={() => setQuestionType('text')} />
            <Button title="Radio" onPress={() => setQuestionType('radio')} />
            <Button title="Checkbox" onPress={() => setQuestionType('checkbox')} />
          </View>
        </View>
      )}

      {/* Question Text Input */}
      {questionType && (
        <>
          <TextInput
            placeholder="Enter Question Text"
            value={questionText}
            onChangeText={setQuestionText}
            style={styles.textarea}
            multiline
            numberOfLines={4}
          />

          {/* Add Image for Question */}
          <TouchableOpacity style={styles.imageButton} onPress={addQuestionImage}>
            <Text style={styles.buttonText}>Attach Image</Text>
          </TouchableOpacity>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.questionImage} />}
        </>
      )}

      {/* Handle Options for radio and checkbox questions */}
      {(questionType === 'radio' || questionType === 'checkbox') && (
        <>
          <View style={styles.buttonContainer}>
            <Button title="Add Option" onPress={handleAddOption} />
          </View>
          {options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <TextInput
                value={option}
                onChangeText={(text) => {
                  const updatedOptions = [...options];
                  updatedOptions[index] = text;
                  setOptions(updatedOptions);
                }}
                placeholder={`Option ${index + 1}`}
                style={styles.input}
              />
              <View style={styles.mediaButtonContainer}>
                <Button title="Add Image for Option" onPress={() => addOptionImage(index)} />
                {optionImages[index] && (
                  <Image source={{ uri: optionImages[index] }} style={styles.optionImage} />
                )}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Add the Question Button */}
      {questionType && (
        <View style={styles.buttonContainer}>
          <Button title="Add Question" onPress={handleAddQuestion} />
        </View>
      )}

      {/* Display Added Questions */}
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <View style={styles.questionItem}>
            <Text>{item.question} ({item.type})</Text>
            {item.type === 'radio' || item.type === 'checkbox' ? (
              item.options.map((option, idx) => (
                <View key={idx} style={styles.optionDisplay}>
                  <Text>{option}</Text>
                  {item.optionImages[idx] && (
                    <Image source={{ uri: item.optionImages[idx] }} style={styles.optionImageDisplay} />
                  )}
                </View>
              ))
            ) : null}
            {item.questionImage && <Image source={{ uri: item.questionImage }} style={styles.questionImage} />}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Save Form Button */}
      <View style={styles.buttonContainer}>
        <Button title="Save Form" onPress={handleSaveForm} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: 36,
    color: 'white',
  },
  questionTypeContainer: {
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  questionImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 15,
  },
  optionContainer: {
    marginVertical: 10,
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
  },
  mediaButtonContainer: {
    marginTop: 10,
  },
  optionImage: {
    width: 50,
    height: 50,
    marginTop: 5,
    borderRadius: 5,
  },
  questionItem: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionDisplay: {
    marginBottom: 10,
  },
  optionImageDisplay: {
    width: 50,
    height: 50,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default FormsScreen;
