import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '@/shared/store/taskStore';
import { isAuthenticated } from '../lib/auth';
import * as taskService from '@/shared/services/taskService';
import { useRouter, useLocalSearchParams } from 'expo-router';
// // Import Firebase directly
// import { deleteDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebaseConfig';

export default function TaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const taskId = params.taskId as string;
  const { selectedTask, setSelectedTask, deleteTask, toggleTaskCompletion } = useTaskContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      if (!taskId) {
        setError('Task ID is missing');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading task with ID:', taskId);
        // Always fetch the task fresh from the service to ensure we have the latest data
        const task = await taskService.getTaskById(taskId);
        if (task) {
          console.log('Task loaded successfully:', task);
          setSelectedTask(task);
        } else {
          setError('Task not found');
        }
      } catch (err) {
        console.error('Error loading task:', err);
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, setSelectedTask]);

  const handleEditTask = () => {
    if (!selectedTask) {
      console.log('Cannot edit: No selected task');
      return;
    }
    
    try {
      console.log('Navigating to edit task:', selectedTask.id);
      // Use relative navigation without leading slash
      router.push({
        pathname: '/TaskForm',
        params: { taskId: selectedTask.id }
      });
    } catch (err) {
      console.error('Navigation error:', err);
      Alert.alert('Error', 'Failed to navigate to edit screen.');
    }
  };

  const handleDeleteTask = () => {
    console.log('Delete button pressed', { taskId });
    if (!taskId) {
      console.log('Cannot delete: Task ID is missing');
      return;
    }
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Use a simpler approach - navigate away first, then delete
            console.log('Confirmed deletion for task:', taskId);
            
            // Navigate first
            router.replace('/(tabs)');
            
            // Then try to delete after navigation has started
            setTimeout(async () => {
              try {
                console.log('Attempting to delete task with ID:', taskId);
                await taskService.deleteTask(taskId);
                console.log('Task deleted successfully (in background)');
              } catch (err) {
                console.error('Background deletion failed:', err);
                // No alert here since we've already navigated away
              }
            }, 500);
          }
        }
      ]
    );
  };

  const handleToggleComplete = async () => {
    if (!taskId || !selectedTask) {
      console.log('Cannot toggle completion: Task data missing');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Toggling completion for task:', taskId, 'Current state:', selectedTask.completed);
      await toggleTaskCompletion(taskId);
      
      // Refresh the task data after toggling completion
      const updatedTask = await taskService.getTaskById(taskId);
      setSelectedTask(updatedTask);
      setLoading(false);
    } catch (err) {
      console.error('Error toggling task completion:', err);
      setLoading(false);
      Alert.alert('Error', 'Failed to update task status.');
    }
  };

  // Format date for display
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'No due date';
    
    try {
      let date;
      
      // Handle different timestamp formats
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        // JavaScript Date object
        date = timestamp;
      } else if (typeof timestamp === 'number' || typeof timestamp === 'string') {
        // Unix timestamp or ISO string
        date = new Date(timestamp);
      } else {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return '';
    
    try {
      let date;
      
      // Handle different timestamp formats
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'number' || typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        return '';
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  if (!isAuthenticated()) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view task details</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading task details...</Text>
      </View>
    );
  }

  if (error || !selectedTask) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Task not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{selectedTask.title}</Text>
          <TouchableOpacity 
            style={[
              styles.statusBadge, 
              selectedTask.completed ? styles.completedBadge : styles.pendingBadge
            ]}
            onPress={handleToggleComplete}
          >
            <Text style={styles.statusText}>
              {selectedTask.completed ? 'Completed' : 'Pending'}
            </Text>
            {selectedTask.completed ? (
              <Ionicons name="checkmark-circle" size={16} color="white" style={styles.statusIcon} />
            ) : (
              <Ionicons name="ellipse-outline" size={16} color="white" style={styles.statusIcon} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.dueDateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.dueDate}>
            {selectedTask.dueDate ? formatDate(selectedTask.dueDate) : 'No due date'}
          </Text>
        </View>
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {selectedTask.description || 'No description provided'}
        </Text>
      </View>
      
      <View style={styles.metadataContainer}>
        <Text style={styles.sectionTitle}>Task Information</Text>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Created:</Text>
          <Text style={styles.metadataValue}>
            {selectedTask.createdAt ? formatTimestamp(selectedTask.createdAt) : 'Unknown'}
          </Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Last Updated:</Text>
          <Text style={styles.metadataValue}>
            {selectedTask.updatedAt ? formatTimestamp(selectedTask.updatedAt) : 'Unknown'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditTask}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteTask}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Delete Task</Text>
        </TouchableOpacity>
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  pendingBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  statusIcon: {
    marginLeft: 4,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  descriptionContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#616161',
    lineHeight: 24,
  },
  metadataContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#757575',
    width: 100,
  },
  metadataValue: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  errorText: {
    padding: 16,
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});