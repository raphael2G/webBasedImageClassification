import tensorflowjs as tfjs
import os

def convert_and_save(model, model1, model2, tfjs_target_dir):
      # saves models as model.json file. os.path.join with specific 
      tfjs.converters.save_keras_model(model, os.path.join(tfjs_target_dir, 'full'))
      tfjs.converters.save_keras_model(model1, os.path.join(tfjs_target_dir, 'split/featureExtraction'))
      tfjs.converters.save_keras_model(model2, os.path.join(tfjs_target_dir, 'split/denseLayers'))
      
      print('-- -- -- -- MODELS CONVERTED -- -- -- --')