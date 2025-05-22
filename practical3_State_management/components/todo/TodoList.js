import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskContext } from '../../store/taskStore';
import { isAuthenticated } from '../../lib/auth';

const TodoList = ({ navigation }) => {
  const { 
    tasks, 
    loading, 
    error, 
    syncTasks, 
    toggleTaskCompletion, 
    setSelectedTask 
  } = useTaskContext();

  useEffect(() => {
    // Refresh tasks when component mounts
    if (isAuthenticated()) {
      syncTasks();
    }
  }, [syncTasks]);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleAddTask = () => {
    navigation.navigate('TaskForm');
  };

  // Format date for display
  const formatDate = (timestamp) => {
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
      <Text style={styles.emptyText}>No tasks yet</Text>
      <Text style={styles.emptySubtext}>Tap the + button to add a new task</Text>
    </View>
  );

  // Render task item
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.taskItem, 
        item.completed && styles.taskItemCompleted
      ]} 
      onPress={() => handleTaskPress(item)}
    >
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => handleToggleComplete(item.id)}
      >
        {item.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#757575" />
        )}
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text 
          style={[
            styles.taskTitle, 
            item.completed && styles.taskTitleCompleted
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

  if (!isAuthenticated()) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view your tasks</Text>
      </View>
    );
  }

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
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

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
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    padding: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default TodoList;