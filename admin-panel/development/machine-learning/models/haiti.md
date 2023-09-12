---
description: Last updated 2 March 2023
---

# Haiti

**Current serverless endpoint:** arn:aws:sagemaker:us-east-1:053061259712:endpoint/haiti3

### Training summary

This is the first validated Greenstand model. Succinctly, we performed transfer learning using a pre-trained Pl@ntNet Inception v4 backbone that had been trained on the [Pl@ntNet300K dataset.](https://github.com/plantnet/PlantNet-300K) The model was further trained on Greenstand seedling data from [The Haiti Tree Project (THTP)](https://www.thehaititreeproject.org/) using 1,945 RGB images resized to 256 x 256 pixels from the 9 most common species. The data was augmented by applying horizontal flips (p=0.5), Gaussian blurs (kernel size of 3), brightness jitter (0.05), and contrast jitter (0.02).&#x20;



### **Hyperparameters**

* 1240 train images, 312 validation images, 393 test images
* 50 epochs
* 16 batch size
* Adam Optimizer with 0.001 learning rate and 0.0 weight decay
* Focal loss (i.e. class-weighted cross-entropy)
* 0.5 horizontal flip probability for augmentation
* 3 Gaussian blur kernel size for augmentation
* 0.05 brightness jitter for augmentation
* 0.02 contrast jitter for augmentation

### Results

| Species  | True Positive | False Positive | True Negative | False Negative | Frequency | Accuracy | Precision | Recall   |
| -------- | ------------- | -------------- | ------------- | -------------- | --------- | -------- | --------- | -------- |
| ACACAURI | 42            | 2              | 347           | 2              | 44        | 0.954545 | 0.954545  | 0.954545 |
| ANACOCCI | 23            | 1              | 367           | 2              | 25        | 0.920000 | 0.958333  | 0.920000 |
| CATALONG | 39            | 2              | 351           | 1              | 40        | 0.975000 | 0.951220  | 0.975000 |
| CEDRODOR | 61            | 4              | 325           | 3              | 64        | 0.953125 | 0.938462  | 0.953125 |
| DOMBTORR | 13            | 2              | 378           | 0              | 13        | 1.000000 | 0.866667  | 1.000000 |
| GREVROBU | 14            | 1              | 377           | 1              | 15        | 0.933333 | 0.933333  | 0.933333 |
| MANGINDI | 145           | 6              | 233           | 9              | 154       | 0.941558 | 0.960265  | 0.941558 |
| SENNSIAM | 10            | 0              | 381           | 2              | 12        | 0.833333 | 1.000000  | 0.833333 |
| SIMAGLAU | 25            | 1              | 366           | 1              | 26        | 0.961538 | 0.961538  | 0.961538 |

Overall test set accuracy: 0.947
