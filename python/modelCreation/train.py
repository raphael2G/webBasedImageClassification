#data processing
import tensorflow_datasets as tfds
import os

#machine learning
import tensorflow as tf
import keras
from keras.models import Sequential
from keras.layers import Dense, Convolution2D

#tfjs conversion
import tensorflowjs as tfjs

import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt


#1 prepare the data
#assign classes
class_names = ['WithMask', 'WithoutMask'] #must match names of folders storing data so def createTrainingData() works
IMG_SIZE = 224
checkpoint_path = "savedModels/faceMaskClassification/"
tfjs_target_dir = 'savedModels/tfjsModel/'

#need to choose if you want masked or unmaksed data 
training_data_path = 'faceMaskClassification/faceMaskDatasetDownloaded/Train' 
testing_data_path = 'faceMaskClassification/faceMaskDatasetDownloaded/Test'

def get_label(file_path):
    parts = tf.strings.split(file_path, os.path.sep)
    index=tf.convert_to_tensor(10)
    for category in class_names: 
        if tf.convert_to_tensor(category) == parts[-2]:
            index = tf.convert_to_tensor(class_names.index(category))
    return index

    #resizes and normalizes image. returns img and label
def process_data(file_path):
    label = get_label(file_path)
    img = tf.io.read_file(file_path)
    img = tf.image.decode_png(img)
    img = tf.image.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img/255.0
    return img, label

def createData(class_names, data_path, shuffle=False, img_show=False):
    train_ds = tf.data.Dataset.list_files(data_path + '/*/*')
    class_names=class_names
    train_ds = train_ds.map(process_data)

    if shuffle: train_ds = train_ds.shuffle(len(list(train_ds))-1)

    return train_ds




#2 build the model
model = Sequential([
            Convolution2D(32, (3, 3,), padding='same', activation='relu', input_shape=(200,200, 3)), #3 for 3 color channels
            Convolution2D(32, (3, 3,), padding='same', activation='relu'),
            tf.keras.layers.Flatten(),
            Dense(64, activation='relu'), 
            Dense(16, activation='relu'), 
            Dense(len(class_names), activation='softmax')
        ])

#3 train the model
loss_fn = tf.losses.SparseCategoricalCrossentropy()
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)

def calc_loss(model, x, y):
    y_ = model(x)
    return loss_fn(y, y_), y_

def calc_grad(model, x, y):
    with tf.GradientTape() as tape:
        loss, y_ = calc_loss(model, x, y)
    return tape.gradient(loss, model.trainable_variables), loss, y_ #return gradient of loss relative to trainable variables

def train(n_epochs, batch_size, with_plot=True, save_weights=False, load_weights=False):
    
    n_epochs = n_epochs
    ds_train = createData(class_names, training_data_path, shuffle=True)
    ds_train_batch = ds_train.batch(batch_size)

    accuracy_history, loss_history,= [], []


    if load_weights: 
        print('...Loading Weights...')
        model.load_weights(os.path.join(checkpoint_path, 'weights/'))
        print('Weights Succesfully Loaded')

    print('Begining training with %i Epochs' %n_epochs)
    for epoch in range(n_epochs):
        print('Epoch: %i' %epoch, 'Time: ' + datetime.now().strftime("%H:%M:%S"))
        epoch_accuracy = keras.metrics.SparseCategoricalAccuracy()
        epoch_loss = keras.metrics.Mean()

        for x, y in ds_train_batch:
            gradient, loss, y_ = calc_grad(model, x, y)
            optimizer.apply_gradients(zip(gradient, model.trainable_variables))

            epoch_accuracy.update_state(y, y_)
            epoch_loss.update_state(loss)
        
        accuracy_history.append(epoch_accuracy.result())
        loss_history.append(epoch_loss.result())

        print('Epoch: %i' %epoch, 'Accuracy: %.2f' %epoch_accuracy.result(), 'Loss: %.6f' %epoch_loss.result())

    if save_weights: 
        model.save_weights(os.path.join(checkpoint_path, 'weights/'))
        print('Model Weights Saved')

    if with_plot: plot(loss_history, accuracy_history)

def plot(loss_history, accuracy_history):
    plt.plot(loss_history, label='loss')
    plt.plot(accuracy_history, label='accuracy') 
    plt.legend()
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy/Loss')
    plt.show()

# ds_train = createData(class_names, training_data_path, shuffle=True)
# for x, y in ds_train.take(10):
#     print(y)

# train(n_epochs=50, batch_size=32, save_weights=True)

model.load_weights(os.path.join(checkpoint_path, 'weights/'))
tfjs.converters.save_keras_model(model, tfjs_target_dir)
     

