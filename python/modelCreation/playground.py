import keras
from splitModel import split_keras_model
from convertModel import convert_and_save


# link to folder where tfjs models should be stored
# make sure folder contains empty folder 'full', and folder 'split' with folders 'featureExtraction', 'denseLayers'
tfjs_target_dir = 'react/public/tfjsModels/teachableMachineFacemaskClassification' 

# link to saved full python model (unsplit)
full_python_model_url = 'python/pythonModels/teachableMachineFacemaskRecognition/full/keras_model.h5'

#loads full python model
model = keras.models.load_model(full_python_model_url)

#splits full python model into 2 models, 
#one for featureExtraction, one for denseLayers 
model1, model2 = split_keras_model(model, 1)

#converts python full model, featureExtraction, and denseLayers
#into tfjs models and saves at tfjs_target_dir 
convert_and_save(model, model1, model2, tfjs_target_dir)