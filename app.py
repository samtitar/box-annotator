import json
import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

INPUT_FILE = "data/ukiyoe_inference_proc.json"
OUTPUT_FILE = "data/ukiyoe_inference_proc.json"


def load_data(path):
    return json.load(open(path))


def load_entry(idx):
    entry_id = idx2entry[idx]
    return annotations["entries"][entry_id]


annotations = load_data(INPUT_FILE)
idx2entry = list(annotations["entries"].keys())


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_annotation/<int:idx>")
def get_annotation(idx):
    entry = load_entry(idx)

    result = {
        "modes": entry["modes"] if "modes" in entry else ["vg"] * len(entry["boxes"]),
        "boxes": entry["boxes"],
        "phrases": entry["phrases"],
        "caption": entry["caption"],
        "image_path": entry["image_path"],
    }

    return jsonify(result)


@app.route("/update_annotation/<int:idx>", methods=["POST"])
def update_annotation(idx):
    data = request.get_json()

    entry_id = idx2entry[idx]

    annotations["entries"][entry_id]["modes"] = data["modes"]
    annotations["entries"][entry_id]["boxes"] = data["boxes"]
    annotations["entries"][entry_id]["phrases"] = data["phrases"]
    annotations["entries"][entry_id]["caption"] = data["caption"]
    annotations["entries"][entry_id][
        "last_annotation"
    ] = datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")

    # dump json
    with open(OUTPUT_FILE, "w") as f:
        json.dump(annotations, f)

    return jsonify({})


if __name__ == "__main__":
    app.run(debug=True)
