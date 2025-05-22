import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '@/shared/store/taskStore';
import { isAuthenticated } from '../../lib/auth';
import { useRouter } from 'expo-router';

// Define TypeScript interfaces for our Task
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: any;
  completed: boolean;
  createdAt?: any;
  updatedAt?: any;
  userId: string;
}

export default function CompletedTasksScreen() {
  const router = useRouter();
  const { 
    tasks, 
    loading, 
    error, 
    syncTasks, 
    toggleTaskCompletion, 
    setSelectedTask 
  } = useTaskContext();

  // Add type assertion to tasks to fix the 'never' type issue
  const taskArray = tasks as Task[];
  
  // Filter to show only completed tasks
  const completedTasks = taskArray.filter((task: Task) => task.completed);

  useEffect(() => {
    // Refresh tasks when component mounts
    if (isAuthenticated()) {
      syncTasks();
    }
  }, [syncTasks]);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    router.push({
      pathname: '/TaskDetail',
      params: { taskId: task.id }
    });
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Format date for display
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No completed tasks</Text>
      <Text style={styles.emptySubtext}>Tasks you complete will appear here</Text>
    </View>
  );

  // Render task item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={[
        styles.taskItem, 
        styles.taskItemCompleted
      ]} 
      onPress={() => handleTaskPress(item)}
    >
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => handleToggleComplete(item.id)}
      >
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text 
          style={[
            styles.taskTitle, 
            styles.taskTitleCompleted
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        
        {item.dueDate && (
          <Text style={styles.taskDate}>
            Due: {formatDate(item.dueDate)}
          </Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#757575" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <FlatList
        data={completedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={completedTasks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
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
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  taskItemCompleted: {
    backgroundColor: '#F9FFF9',
  },
  checkbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  taskDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  errorText: {
    padding: 16,
    color: 'red',
    textAlign: 'center',
  },
});