import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For selecting images
import { MaterialIcons } from 'react-native-vector-icons'; // For attach logo
import axios from 'axios';  // Import axios for HTTP requests

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
  };

  // Function to handle selecting an image for the question
  const addQuestionImage = async () => {
    const uri = await pickImage();
    setImageUri(uri);
  };

  // Function to handle adding an option
  const handleAddOption = () => {
    setOptions([...options, '']);
    setOptionImages([...optionImages, null]); // Initialize the image array with null
  };

  // Function to handle adding an image for an option
  const addOptionImage = async (index) => {
    const uri = await pickImage();
    const newOptionImages = [...optionImages];
    newOptionImages[index] = uri;
    setOptionImages(newOptionImages);
  };

  // Function to handle saving the form to the database
  const handleSaveForm = async () => {
    try {
      const formData = new FormData();
      formData.append('formName', formName);

      // Append questions and images
      questions.forEach((question, index) => {
        formData.append(`questions[${index}][question]`, question.question);
        formData.append(`questions[${index}][type]`, question.type);
        question.options.forEach((option, optIndex) => {
          formData.append(`questions[${index}][options][${optIndex}]`, option);
        });

        // Append images for the question
        if (question.questionImage) {
          const localUri = question.questionImage;
          const filename = localUri.split('/').pop();
          const type = `image/${filename.split('.').pop()}`;
          const image = { uri: localUri, name: filename, type };
          formData.append('questionImage', image);
        }

        // Append images for the options
        question.optionImages.forEach((optionImage, optIndex) => {
          if (optionImage) {
            const localUri = optionImage;
            const filename = localUri.split('/').pop();
            const type = `image/${filename.split('.').pop()}`;
            const image = { uri: localUri, name: filename, type };
            formData.append('optionImages', image);
          }
        });
      });

      // Send POST request to the backend API
      const response = await axios.post('http://localhost:5000/api/forms', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form saved:', response.data);
      alert('Form saved successfully!');
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form. Please try again!');
    }
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

      {/* Show Question Type Options */}
      {questionType === null && (
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
          <View style={styles.textareaContainer}>
            <TextInput
              placeholder="Enter Question Text"
              value={questionText}
              onChangeText={setQuestionText}
              style={styles.textarea}
              multiline
              numberOfLines={3} // Smaller height for text area
            />
            {/* Attach Image Button inside the Text Area */}
            <TouchableOpacity style={styles.attachImageButton} onPress={addQuestionImage}>
              <MaterialIcons name="attach-file" size={24} color="white" />
            </TouchableOpacity>
          </View>

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
              <View style={styles.optionInputContainer}>
                <Text style={styles.optionLabel}>Option {index + 1}:</Text>
                <TextInput
                  value={option}
                  onChangeText={(text) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = text;
                    setOptions(updatedOptions);
                  }}
                  placeholder={`Enter Option ${index + 1}`}
                  style={styles.input}
                />
                {/* Attach Image for Option inside the Text Area */}
                <TouchableOpacity
                  style={styles.optionAttachButton}
                  onPress={() => addOptionImage(index)}
                >
                  <MaterialIcons name="attach-file" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Display the image for the option */}
              {optionImages[index] && (
                <Image source={{ uri: optionImages[index] }} style={styles.optionImage} />
              )}
            </View>
          ))}
        </>
      )}

      {/* Done Button to Add Question */}
      {questionType && (
        <View style={styles.buttonContainer}>
          <Button title="Done" onPress={handleAddQuestion} />
        </View>
      )}

      {/* Display Added Questions */}
      <FlatList
        data={questions}
        renderItem={({ item, index }) => (
          <View style={styles.questionItem}>
            <Text>{`Question ${index + 1}: ${item.question} (${item.type})`}</Text>
            {item.type === 'radio' || item.type === 'checkbox' ? (
              item.options.map((option, idx) => (
                <View key={idx} style={styles.optionDisplay}>
                  <Text>{`Option ${idx + 1}: ${option}`}</Text>
                  <Text style={styles.optionSign}>
                    {item.type === 'radio' ? '⚪' : '☑️'} {/* Display radio or checkbox sign */}
                  </Text>
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
  textareaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  textarea: {
    height: 50,  // Reduced height for smaller text area
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    flex: 1,
    fontSize: 16,
  },
  attachImageButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  questionImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
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
  buttonContainer: {
    marginBottom: 15,
  },
  optionContainer: {
    marginVertical: 10,
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
  },
  optionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  optionAttachButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionImage: {
    width: 80,
    height: 80,
    marginTop: 10,
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
  optionSign: {
    fontSize: 18,
    marginTop: 5,
    color: '#4CAF50',
  },
  optionImageDisplay: {
    width: 50,
    height: 50,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default FormsScreen;
