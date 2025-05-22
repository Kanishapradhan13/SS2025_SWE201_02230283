import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Switch,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTaskContext } from '@/shared/store/taskStore';
import * as taskService from '@/shared/services/taskService';
import { isAuthenticated } from '../lib/auth';

export default function TaskForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [completed, setCompleted] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { createTask, updateTask } = useTaskContext();
  
  // Determine if we're editing an existing task or creating a new one
  const isEditing = !!taskId;
  
  useEffect(() => {
    const loadTask = async () => {
      if (!isAuthenticated()) {
        return;
      }
      
      if (isEditing) {
        try {
          setLoading(true);
          console.log('Loading task for editing with ID:', taskId);
          const task = await taskService.getTaskById(taskId);
          
          if (task) {
            console.log('Task loaded successfully:', task);
            setTitle(task.title || '');
            setDescription(task.description || '');
            setCompleted(task.completed || false);
            
            if (task.dueDate) {
              let date;
              if (task.dueDate.toDate && typeof task.dueDate.toDate === 'function') {
                date = task.dueDate.toDate();
              } else if (task.dueDate instanceof Date) {
                date = task.dueDate;
              } else {
                date = new Date(task.dueDate);
              }
              setDueDate(date);
            }
          } else {
            setError('Task not found');
          }
        } catch (err) {
          console.error('Error loading task for editing:', err);
          setError('Failed to load task.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadTask();
  }, [taskId, isEditing]);
  
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
        completed: completed,
      };
      
      if (isEditing) {
        console.log('Updating task:', taskId, taskData);
        await updateTask(taskId, taskData);
        console.log('Task updated successfully');
      } else {
        console.log('Adding new task:', taskData);
        await createTask(taskData);
        console.log('Task added successfully');
      }
      
      setLoading(false);
      
      // Skip the alert and navigate directly to avoid potential issues with alert callback
      console.log('Task operation successful, navigating to All Tasks');
      
      // Use setTimeout to ensure state updates complete before navigation
      setTimeout(() => {
        // Force navigation to the All Tasks tab
        router.replace('/(tabs)');
      }, 300);
    } catch (err) {
      console.error('Error saving task:', err);
      setLoading(false);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };
  
  const handleClearDate = () => {
    setDueDate(null);
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (!isAuthenticated()) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to manage tasks</Text>
      </View>
    );
  }
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>
          {isEditing ? 'Loading task...' : 'Creating task...'}
        </Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title*</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Due Date</Text>
          
          <View style={styles.dateContainer}>
            {dueDate ? (
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDate}>{formatDate(dueDate)}</Text>
                <TouchableOpacity onPress={handleClearDate}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.noDate}>No due date set</Text>
            )}
            
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="white" />
              <Text style={styles.dateButtonText}>
                {dueDate ? 'Change Date' : 'Set Due Date'}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        </View>
        
        {isEditing && (
          <View style={styles.formGroup}>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Mark as Completed</Text>
              <Switch
                value={completed}
                onValueChange={setCompleted}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={completed ? '#2196F3' : '#f4f3f4'}
              />
            </View>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Task' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212121',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#424242',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212121',
  },
  textArea: {
    height: 120,
  },
  dateContainer: {
    marginBottom: 10,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedDate: {
    fontSize: 16,
    color: '#212121',
  },
  noDate: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#616161',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    padding: 16,
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});