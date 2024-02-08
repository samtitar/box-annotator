import torch
from torchvision.ops import box_convert
import pickle
import json

def load_data(path):
    with open(path, 'rb') as f:
        output = pickle.load(f)

    return output


def preprocess(path, out_path='ukiyoe_inference_proc.json'):
    data = load_data(path)

    proc_data = {}
    proc_data['settings'] = data['settings']
    proc_data['entries'] = {}


    for k, v in data['results'].items():
        cur_entry = {}
        cur_entry['boxes'] = box_convert(v['boxes'], in_fmt='cxcywh', out_fmt='xywh').tolist()
        cur_entry['phrases'] = v['phrases']
        cur_entry['logits'] = v['logits'].tolist()
        cur_entry['caption'] = v['caption']
        cur_entry['image_path'] = v['image_path'].split('/')[-1]

        proc_data['entries'][k] = cur_entry


    with open(out_path, 'w') as f:
        json.dump(proc_data, f)

    

    




preprocess('ukiyoe_inference_results.pkl')